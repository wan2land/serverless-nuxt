import serverlessExpress from '@vendia/serverless-express'
import { Handler } from 'aws-lambda'

const { Nuxt } = require('nuxt-start') // eslint-disable-line

export function createNuxtHandler(nuxtConfig: any): Handler<any, any> {
  const nuxt = new Nuxt({
    ...nuxtConfig,
    dev: false,
    _start: true,
  })

  let serverPromise = null as Promise<Handler<any, any>> | null
  return (event, ctx, callback) => {
    if (!serverPromise) {
      serverPromise = Promise.resolve(nuxt?.ready()).then(() => serverlessExpress({ app: nuxt.server.app }))
    }
    return serverPromise.then((server) => server(event, ctx, callback))
  }
}
