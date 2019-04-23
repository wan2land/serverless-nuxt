"use strict"

const messagePrefix = "Nuxt: "

class ServerlessNuxtPlugin {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options || {}
    this.servicePath = this.serverless.service.serverless.config.servicePath

    this.commands = {
      nuxt: {
        usage: "Sync directories and S3 prefixes",
        lifecycleEvents: [
          "sync"
        ],
      }
    }

    this.hooks = {
      "after:deploy:deploy": this.deploy.bind(this),
      "before:remove:remove": this.clear.bind(this),
      "nuxt:sync": () => this.sync.bind(this),
    }
  }

  client() {
    const provider = this.serverless.getProvider("aws")
    const awsCredentials = provider.getCredentials()
    return new provider.sdk.S3({
      region: awsCredentials.region,
      credentials: awsCredentials.credentials,
    })
  }

  sync() {
    const nuxt = this.serverless.service.custom.nuxt
    const cli = this.serverless.cli
    cli.consoleLog(`${messagePrefix} sync ${JSON.stringify(nuxt)}`)
  }

  deploy() {
    const nuxt = this.serverless.service.custom.nuxt
    const cli = this.serverless.cli
    cli.consoleLog(`${messagePrefix} deploy ${JSON.stringify(nuxt)}`)
  }

  clear() {
    const nuxt = this.serverless.service.custom.nuxt
    const cli = this.serverless.cli
    cli.consoleLog(`${messagePrefix} clear ${JSON.stringify(nuxt)}`)
  }
}

module.exports = ServerlessNuxtPlugin
