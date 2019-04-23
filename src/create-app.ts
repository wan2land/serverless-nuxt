import { APIGatewayProxyHandler } from "aws-lambda"
import sls from "serverless-http"
import express from "express"

const { Nuxt } = require("nuxt") // eslint-disable-line

export function createApp(config: any): APIGatewayProxyHandler {
  const app = express()
  const nuxt = new Nuxt({
    ...config,
    dev: false,
  })

  app.use(nuxt.render)

  const slsApp = sls(app)
  let isReady = false

  return async (event, ctx) => {
    if (!isReady) {
      if (nuxt.ready) {
        await nuxt.ready()
      }
      isReady = true
    }
    return slsApp(event, ctx) as any
  }
}
