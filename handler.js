const { createNuxtHandler } = require('nuxt-aws-lambda')
const config = require('./nuxt.config.js')

module.exports.render = createNuxtHandler(config)
