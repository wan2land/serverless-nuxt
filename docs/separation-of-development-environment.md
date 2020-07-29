# Separation of development environment

`.env-cmdrc.js`

```js
module.exports = {
  local: {
    NODE_ENV: 'development',
    PORT: '8080',

    // API_URL: 'https://api.dev.my-nuxt-project.com',
  },
  dev: {
    DOMAIN_NAME: 'dev.my-nuxt-project.com',
    NODE_ENV: 'production',
    NUXT_TELEMETRY_DISABLED: '1',

    // API_URL: 'https://api.dev.my-nuxt-project.com',
  },
  prod: {
    DOMAIN_NAME: 'my-nuxt-project.com',
    NODE_ENV: 'production',
    NUXT_TELEMETRY_DISABLED: '1',

    // API_URL: 'https://api.my-nuxt-project.com',
  },
}
```

`package.json`

```json
{
  /* ... */
  "scripts": {
    "dev": "env-cmd -e local nuxt",
    "deploy:dev": "env-cmd -e dev sls deploy --stage dev",
    "deploy:prod": "env-cmd -e prod sls deploy --stage prod"
  },
  /* ... */
}
```

Create a domain. You only need to do this once when creating a project.

```bash
npx env-cmd -e dev sls create_domain
npx env-cmd -e prod sls create_domain
```

Deploy your project to AWS Lambda using serverless.

```bash
npm run deploy:dev
npm run deploy:prod
```
