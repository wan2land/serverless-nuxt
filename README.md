# Serverless Nuxt Plugin

<p>
  <a href="https://github.com/wan2land/serverless-nuxt/actions?query=workflow%3A%22Node.js+CI%22"><img alt="Build" src="https://img.shields.io/github/workflow/status/wan2land/serverless-nuxt/Node.js%20CI?logo=github&style=flat-square" /></a>
  <a href="https://npmcharts.com/compare/serverless-nuxt?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/serverless-nuxt.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/serverless-nuxt"><img alt="Version" src="https://img.shields.io/npm/v/serverless-nuxt.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/serverless-nuxt"><img alt="License" src="https://img.shields.io/npm/l/serverless-nuxt.svg?style=flat-square" /></a>
  <img alt="Typescript" src="https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square" />
  <br />
  <a href="https://david-dm.org/wan2land/serverless-nuxt"><img alt="dependencies Status" src="https://img.shields.io/david/wan2land/serverless-nuxt.svg?style=flat-square" /></a>
  <a href="https://david-dm.org/wan2land/serverless-nuxt?type=dev"><img alt="devDependencies Status" src="https://img.shields.io/david/dev/wan2land/serverless-nuxt.svg?style=flat-square" /></a>
</p>

Nuxt on AWS(Lambda + S3) with Serverless Framework.

## Demo

- [serverless-nuxt.dist.be](https://serverless-nuxt.dist.be)
- [Source](https://github.com/wan2land/serverless-nuxt/tree/example)

## Installation

Installation is done using the `npm install` command:

```bash
npm i serverless-nuxt
npm i serverless serverless-nuxt-plugin -D
```

**Check out [our complete installation guide](./docs/installation.md) to setting up your project.**

## Documents

- [Installation Guide](./docs/installation.md)
- [Separation of development environment](./docs/separation-of-development-environment.md)
- [Use Custom URL instead of S3 Bucket URL](./docs/use-custom-url-instead-of-s3-bucket-url.md)
- [Redirect www URLs to non-www](./docs/redirect-www-urls-to-non-www.md)

## Options

```yml
custom:
  nuxt:
    version: v${file(./package.json):version}
    bucketName: my-nuxt-project-${self:provider.stage}
    cdnPath:
    assetsPath:
    assetsCacheMaxAge:
```

Name                 | Description | Default
---------------------| ----------- | ------- |
version (required)   | version     |
bucketName (required)| AWS S3 Bucket Name for static files
cdnPath              | CDN Path. If this value is not set, the default S3 route(`https://${config.bucketName}.s3.amazonaws.com`) is used. | `null` 
assetsPath           | Path of assets created after nuxt build. | `".nuxt/dist/client"`
assetsCacheMaxAge    | CacheControl MaxAge to use when uploading assets to S3. Using [ms](https://github.com/zeit/ms#examples). | `365d`
