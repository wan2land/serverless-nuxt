
module.exports = {
  local: {
    NODE_ENV: 'development',
    PORT: '8080',
  },
  prod: {
    DOMAIN_NAME: 'serverless-nuxt.dist.be',
    NODE_ENV: 'production',
    NUXT_TELEMETRY_DISABLED: '1',
  },
}
