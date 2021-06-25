

module.exports = {
  telemetry: false,
  target: 'server',
  head: {
    title: 'Serverless Nuxt Example',
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
  pwa: {
    icon: false,
    manifest: {
      name: 'Serverless Nuxt Example',
      display: 'standalone',
      theme_color: '#008200',
      start_url: 'https://serverless-nuxt.dist.be/?standalone=true&utm_source=homescreen',
      icons: [
        {
          src: 'https://serverless-nuxt.dist.be/icons/512x512.png',
          type: 'image/png',
          sizes: '512x512'
        },
        {
          src: 'https://serverless-nuxt.dist.be/icons/192x192.png',
          type: 'image/png',
          sizes: '192x192'
        }
      ],
    },
  },
  plugins: [
  ],
  components: true,
  buildModules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/pwa',
  ],
  modules: [
  ],
  build: {
    publicPath: process.env.SERVERLESS_NUXT_PUBLIC_PATH,
  }
}
