"use strict"

const path = require("path") // eslint-disable-line
const fs = require("fs") // eslint-disable-line
const globby = require("globby") // eslint-disable-line
const chalk = require("chalk").default // eslint-disable-line
const mime = require("mime-types") // eslint-disable-line
const { Nuxt, Builder, Generator } = require("nuxt") // eslint-disable-line

function normlizeConfig(config) {
  return {
    version: config.version,
    bucketName: config.bucketName,
    assetsPath: config.assetsPath || ".nuxt/dist/client",
    cdnPath: config.cdnPath || null,
  }
}

class ServerlessNuxtPlugin {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options || {}
    this.servicePath = this.serverless.service.serverless.config.servicePath

    this.commands = {
      nuxt: {
        usage: "Build Nuxt and upload assets files.",
        lifecycleEvents: ["build", "upload"],
        commands: {
          build: {
            usage: "Build Nuxt.",
            lifecycleEvents: ["build"],
          },
          upload: {
            usage: "Upload asset files.",
            lifecycleEvents: ["upload"],
          },
        },
      }
    }

    this.hooks = {
      "before:package:createDeploymentArtifacts": this.build.bind(this),
      "after:deploy:deploy": this.upload.bind(this),
      "nuxt:build": this.build.bind(this),
      "nuxt:upload": this.upload.bind(this),
    }
  }

  async build() {
    const provider = this.serverless.getProvider("aws")
    const awsCredentials = provider.getCredentials()

    const config = normlizeConfig(this.serverless.service.custom.nuxt || {})

    const servicePath = this.serverless.service.serverless.config.servicePath
    const configPath = path.resolve(servicePath, "nuxt.config.js")

    this.serverless.cli.consoleLog(`Serverless Nuxt Plugin: ${chalk.yellow("build nuxt")}`)

    const env = this.serverless.service.provider.environment || {}
    Object.assign(process.env, env)

    let nuxtConfig = require(configPath) // eslint-disable-line
    nuxtConfig = nuxtConfig.default ? nuxtConfig.default : nuxtConfig
    nuxtConfig.build = nuxtConfig.build || {}

    const assetBasePath = config.cdnPath ? config.cdnPath.replace(/\/+$/, "") : `https://s3.${awsCredentials.region}.amazonaws.com/${config.bucketName}`
    nuxtConfig.build.publicPath = `${assetBasePath}/${config.version}/`

    const nuxt = new Nuxt({...nuxtConfig, dev: false})
    const builder = new Builder(nuxt)
    if (typeof builder.build === 'function') { // for nuxt v2.9.x
      builder.build()
    } else {
      const generator = new Generator(nuxt, builder)
      await generator.generate({build: true})
    }
  }

  async upload() {
    const provider = this.serverless.getProvider("aws")
    const awsCredentials = provider.getCredentials()
    const s3 = new provider.sdk.S3({
      region: awsCredentials.region,
      credentials: awsCredentials.credentials,
    })

    const config = normlizeConfig(this.serverless.service.custom.nuxt || {})

    const servicePath = this.serverless.service.serverless.config.servicePath
    const assetsPath = path.resolve(servicePath, config.assetsPath)

    this.serverless.cli.consoleLog(`Serverless Nuxt Plugin: ${chalk.yellow("upload asset files")}`)
    const assetsFiles = await globby(assetsPath, {onlyFiles: true})
    await Promise.all(assetsFiles.map((file) => {
      const fileTargetPath = [config.version, file.replace(assetsPath, "")].join("/")
        .replace(/^\/+|\/+$/, "")
        .replace(/\/+/, "/")

      return s3.putObject({
        Bucket: config.bucketName,
        Key: fileTargetPath,
        Body: fs.readFileSync(file),
        ACL: "public-read",
        ContentType: mime.lookup(file) || null,
      }).promise()
    }))
  }
}

module.exports = ServerlessNuxtPlugin
