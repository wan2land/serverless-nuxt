
const path = require('path')
const fs = require('fs')
const globby = require('globby')
const chalk = require('chalk')
const mime = require('mime-types')
const ms = require('ms')
const { Nuxt, Builder, Generator } = require('nuxt')

function normlizeConfig(config) {
  return {
    version: config.version,
    bucketName: config.bucketName,
    assetsPath: config.assetsPath || '.nuxt/dist/client',
    cdnPath: config.cdnPath || null,
    assetsCacheMaxAge: `${config.assetsCacheMaxAge || '365d'}`,
  }
}

class ServerlessNuxtPlugin {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options || {}
    this.servicePath = this.serverless.service.serverless.config.servicePath
    this.isUploadedAssets = false

    this.commands = {
      nuxt: {
        usage: 'Build Nuxt and upload assets files.',
        lifecycleEvents: ['build', 'upload'],
        commands: {
          build: {
            usage: 'Build Nuxt.',
            lifecycleEvents: ['build'],
          },
          upload: {
            usage: 'Upload asset files.',
            lifecycleEvents: ['upload'],
          },
        },
      },
    }

    this.hooks = {
      'before:package:createDeploymentArtifacts': this.build.bind(this),
      'after:aws:deploy:deploy:uploadArtifacts': this.afterUploadArtifacts.bind(this),
      'after:aws:deploy:deploy:updateStack': this.afterUpdateStack.bind(this),
      'nuxt:build': this.build.bind(this),
      'nuxt:upload': this.upload.bind(this),
    }
  }

  async build() {
    const config = normlizeConfig(this.serverless.service.custom.nuxt || {})

    const servicePath = this.serverless.service.serverless.config.servicePath
    const configPath = path.resolve(servicePath, 'nuxt.config')

    this.serverless.cli.consoleLog(`Serverless Nuxt Plugin: ${chalk.yellow('build nuxt')}`)

    const assetBasePath = config.cdnPath ? config.cdnPath.replace(/\/+$/, '') : `https://${config.bucketName}.s3.amazonaws.com`
    this.serverless.service.provider.environment = Object.assign(this.serverless.service.provider.environment || {}, {
      SERVERLESS_NUXT_PUBLIC_PATH: `${assetBasePath}/${config.version}/`,
    })

    const env = this.serverless.service.provider.environment || {}
    Object.assign(process.env, env)

    let nuxtConfig = require(configPath) // eslint-disable-line
    nuxtConfig = nuxtConfig.default ? nuxtConfig.default : nuxtConfig

    const nuxt = new Nuxt({ ...nuxtConfig, dev: false })
    const builder = new Builder(nuxt)
    if (typeof builder.build === 'function') { // for nuxt v2.9.x
      await builder.build()
    } else {
      const generator = new Generator(nuxt, builder)
      await generator.generate({ build: true })
    }
  }

  async afterUploadArtifacts() {
    this.serverless.cli.consoleLog(`Serverless Nuxt Plugin: ${chalk.yellow('after upload artifacts')}`)
    await this.upload(true)
  }

  async afterUpdateStack() {
    this.serverless.cli.consoleLog(`Serverless Nuxt Plugin: ${chalk.yellow('after update stack')}`)
    if (!this.isUploadedAssets) {
      await this.upload()
    }
  }

  async upload(ignoreBucketExists = false) {
    const provider = this.serverless.getProvider('aws')
    const awsCredentials = provider.getCredentials()
    const s3 = new provider.sdk.S3({
      region: provider.getRegion(),
      credentials: awsCredentials.credentials,
    })

    const config = normlizeConfig(this.serverless.service.custom.nuxt || {})

    try {
      await s3.headBucket({
        Bucket: config.bucketName,
      }).promise()
    } catch (e) {
      if (ignoreBucketExists) {
        this.serverless.cli.consoleLog(`Serverless Nuxt Plugin: ${chalk.yellow('not found asset bucket')}`)
        return
      }
      throw new Error('not found asset bucket')
    }

    const servicePath = this.serverless.service.serverless.config.servicePath
    const assetsPath = path.resolve(servicePath, config.assetsPath)

    this.serverless.cli.consoleLog(`Serverless Nuxt Plugin: ${chalk.yellow('upload asset files')}`)
    const assetsFiles = await globby(assetsPath, { onlyFiles: true })
    await Promise.all(assetsFiles.map((file) => {
      const fileTargetPath = [config.version, file.replace(assetsPath, '')].join('/')
        .replace(/^\/+|\/+$/, '')
        .replace(/\/+/g, '/')

      return s3.putObject({
        Bucket: config.bucketName,
        Key: fileTargetPath,
        Body: fs.readFileSync(file),
        ACL: 'public-read',
        ContentType: mime.lookup(file) || null,
        CacheControl: `public, max-age=${Math.floor(ms(config.assetsCacheMaxAge) / 1000)}`, // let the browser cache all static files for 1 year since they receive a unique hash by Nuxt
      }).promise()
    }))

    this.isUploadedAssets = true
  }
}

module.exports = ServerlessNuxtPlugin
