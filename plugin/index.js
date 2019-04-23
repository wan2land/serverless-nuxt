"use strict"

const path = require("path") // eslint-disable-line
const fs = require("fs") // eslint-disable-line
const globby = require("globby") // eslint-disable-line
const chalk = require("chalk").default // eslint-disable-line

function normlizeConfig(config) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const date = now.getDate()
  return {
    version: config.version || [year, month < 10 ? "0" + month : month, date < 10 ? "0" + date : date].join(""),
    bucketName: config.bucketName,
    bucketPrefix: config.bucketPreifx || "",
    assetsPath: config.assetsPath || ".nuxt/dist/client",
    staticPath: config.staticPath || "static",
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
      "before:deploy:resources": this.sync.bind(this),
      "before:remove:remove": this.clear.bind(this),
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
    const assetsPath = path.resolve(servicePath, config.assetsPath)
    const staticPath = path.resolve(servicePath, config.staticPath)

    const env = this.serverless.service.provider.environment = this.serverless.service.provider.environment || {}
    Object.assign(env, {
      SLS_NUXT_ENABLE: "true",
      SLS_NUXT_STATIC_PATH: `https://s3.ap-northeast-2.amazonaws.com/${config.bucketName}/${config.bucketPrefix}${stage}/${config.version}/static/`,
      SLS_NUXT_SSSETS_PATH: `https://s3.ap-northeast-2.amazonaws.com/${config.bucketName}/${config.bucketPrefix}${stage}/${config.version}/assets/`,
    })

    // upload files
    this.serverless.cli.consoleLog(`${chalk.yellow("Serverless Nuxt Plugin")} upload asset files`)
    const assetsFiles = await globby(assetsPath, {onlyFiles: true})
    await Promise.all(assetsFiles.map((file) => {
      const fileTargetPath = config.bucketPrefix + [stage, config.version, "assets", file.replace(assetsPath, "").replace(/^\/+|\/+$/, "")].join("/")
      return s3.putObject({
        Bucket: config.bucketName,
        Key: fileTargetPath,
        Body: fs.readFileSync(file),
        ACL: "public-read",
      }).promise()
    }))

    this.serverless.cli.consoleLog(`${chalk.yellow("Serverless Nuxt Plugin")} upload static files`)
    const staticFiles = await globby(staticPath, {onlyFiles: true})
    await Promise.all(staticFiles.map((file) => {
      const fileTargetPath = config.bucketPrefix + [stage, config.version, "static", file.replace(staticPath, "").replace(/^\/+|\/+$/, "")].join("/")
      return s3.putObject({
        Bucket: config.bucketName,
        Key: fileTargetPath,
        Body: fs.readFileSync(file),
        ACL: "public-read",
      }).promise()
    }))
  }

  clear() {
    const config = normlizeConfig(this.serverless.service.custom.nuxt || {})
    this.serverless.cli.consoleLog(`${messagePrefix} clear ${JSON.stringify(config)}`)
    return Promise.resolve()
  }
}

module.exports = ServerlessNuxtPlugin
