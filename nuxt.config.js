

module.exports = {
  telemetry: false,
  target: 'server',
  head: {
    title: 'serverless-sample',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  css: [
  ],
  plugins: [
  ],
  components: true,
  buildModules: [
  ],
  modules: [
  ],
  build: {
    publicPath: process.env.SERVERLESS_NUXT_PUBLIC_PATH,
  }
}
