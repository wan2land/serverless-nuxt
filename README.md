# Serverless Nuxt

Serverless Nuxt

<p>
  <a href="https://travis-ci.org/corgidisco/safen"><img alt="Build" src="https://img.shields.io/travis/corgidisco/safen.svg" /></a>
  <a href="https://npmcharts.com/compare/safen?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/safen.svg" /></a>
  <a href="https://www.npmjs.com/package/safen"><img alt="Version" src="https://img.shields.io/npm/v/safen.svg" /></a>
  <a href="https://www.npmjs.com/package/safen"><img alt="License" src="https://img.shields.io/npm/l/safen.svg" /></a>
  <br />
  <a href="https://david-dm.org/corgidisco/safen"><img alt="dependencies Status" src="https://david-dm.org/corgidisco/safen/status.svg" /></a>
  <a href="https://david-dm.org/corgidisco/safen?type=dev"><img alt="devDependencies Status" src="https://david-dm.org/corgidisco/safen/dev-status.svg" /></a>
  <br />
  <a href="https://www.npmjs.com/package/safen"><img alt="NPM" src="https://nodei.co/npm/safen.png" /></a>
</p>

## Installation

```bash
npm i serverless-nuxt
```

**handler.js**

```js
const { createApp } = require("serverless-nuxt")
const config = require("./nuxt.config.js")

module.exports.render = createApp(config)
```

**serverless.yml**

```yml
service:
  name: serverless-nuxt

plugins:
  - serverless-nuxt/plugin

resources:
  Resources:
    AssetsBucket:
      Type: AWS::S3::Bucket
      Properties:
        BucketName: serverless-nuxt-example

provider:
  name: aws
  stage: ${opt:stage, 'dev'}
  runtime: nodejs8.10
  environment:
    NODE_ENV: ${file(.env.${self:provider.stage}.yml):NODE_ENV}

custom:
  nuxt:
    bucketName: serverless-nuxt-example

functions:
  nuxt:
    handler: handler.render
    events:
      - http: ANY /
      - http: ANY /{proxy+}
```

**nuxt.config.js**

```js
const pkg = require("./package.json")

const routerBase = process.env.SLS_NUXT_ENABLE ? "/dev/" : "/"
const staticPath = process.env.SLS_NUXT_STATIC_PATH || "/"
const assetsPath = process.env.SLS_NUXT_SSSETS_PATH || "/_nuxt/"

module.exports = {
  mode: "universal",
  head: {
    title: pkg.name,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: pkg.description }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: staticPath + "favicon.ico" }
    ]
  },
  router: {
    base: routerBase,
  },
  build: {
    publicPath: assetsPath,
  }
}
```

## Option

```yml
custom:
  nuxt:
    version:
    bucketName:
    bucketPrefix:
    assetsPath:
    staticPath:
```

Name                 | Description | Default
---------------------| ----------- | ------- |
version              | version     | `{YYYYMMDD}`
bucketName (required)| AWS S3 Bucket Name for static files
bucketPrefix         |  | `""`
assetsPath           |  | `".nuxt/dist/client"`
staticPath           |  | `"static"`


## References

- [Serverless plugin author's cheat sheet](https://gist.github.com/HyperBrain/50d38027a8f57778d5b0f135d80ea406)

## License

MIT
