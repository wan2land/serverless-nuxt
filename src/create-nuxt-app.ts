import { APIGatewayProxyHandler } from "aws-lambda"
import express from "express"
import sls from "serverless-http"

const { Nuxt } = require("nuxt") // eslint-disable-line

export function createNuxtApp(config: any): APIGatewayProxyHandler {
  config = config.default ? config.default : config

  const app = express()
  const nuxt = new Nuxt({
    ...config,
    dev: false,
  })

  app.use(async (req, res) => {
    await nuxt.ready()
    nuxt.render(req, res)
  })

  return sls(app)
}
