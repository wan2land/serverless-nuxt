"use strict"

const path = require("path") // eslint-disable-line
const fs = require("fs") // eslint-disable-line
const globby = require("globby") // eslint-disable-line
const chalk = require("chalk").default // eslint-disable-line
const { Nuxt, Builder, Generator } = require("nuxt") // eslint-disable-line

function normlizeConfig(config) {
  return {
    version: config.version,
    bucketName: config.bucketName,
    bucketPrefix: config.bucketPreifx || "",
    assetsPath: config.assetsPath || ".nuxt/dist/client",
  }
}

class ServerlessNuxtPlugin {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options || {}
    this.servicePath = this.serverless.service.serverless.config.servicePath

    this.commands = {
      nuxt: {
        usage: "Build Nuxt and sync assets and static files",
        lifecycleEvents: [
          "sync",
        ],
      }
    }

    this.hooks = {
      "before:package:createDeploymentArtifacts": this.sync.bind(this),
      "before:deploy:function:packageFunction": () => {
        this.serverless.cli.consoleLog(`Serverless Nuxt Plugin ${chalk.yellow("deploy function")}`)
        return this.sync()
      },
      "nuxt:sync": this.sync.bind(this),
    }
  }

  async sync() {
    const provider = this.serverless.getProvider("aws")
    const awsCredentials = provider.getCredentials()
    const s3 = new provider.sdk.S3({
      region: awsCredentials.region,
      credentials: awsCredentials.credentials,
    })

    const config = normlizeConfig(this.serverless.service.custom.nuxt || {})
    const stage = this.serverless.variables.options.stage || "dev"

    const servicePath = this.serverless.service.serverless.config.servicePath
    const configPath = path.resolve(servicePath, "nuxt.config.js")
    const assetsPath = path.resolve(servicePath, config.assetsPath)

    this.serverless.cli.consoleLog(`Serverless Nuxt Plugin ${chalk.yellow("build nuxt")}`)

    const env = this.serverless.service.provider.environment || {}
    Object.assign(process.env, env)

    let nuxtOptions = require(configPath) // eslint-disable-line
    nuxtOptions = nuxtOptions.default ? nuxtOptions.default : nuxtOptions

    const nuxt = new Nuxt({...nuxtOptions, dev: false})
    const builder = new Builder(nuxt)
    const generator = new Generator(nuxt, builder)
    await generator.generate({build: true})

    // upload files
    this.serverless.cli.consoleLog(`Serverless Nuxt Plugin ${chalk.yellow("upload asset files")}`)
    const assetsFiles = await globby(assetsPath, {onlyFiles: true})
    await Promise.all(assetsFiles.map((file) => {
      const fileTargetPath = config.bucketPrefix + [stage, config.version, file.replace(assetsPath, "").replace(/^\/+|\/+$/, "")].join("/")
      return s3.putObject({
        Bucket: config.bucketName,
        Key: fileTargetPath,
        Body: fs.readFileSync(file),
        ACL: "public-read",
      }).promise()
    }))
  }
}

module.exports = ServerlessNuxtPlugin
