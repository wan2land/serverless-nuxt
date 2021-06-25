# Nuxt AWS Lambda

[![Downloads](https://img.shields.io/npm/dt/nuxt-aws-lambda.svg?style=flat-square)](https://npmcharts.com/compare/nuxt-aws-lambda?minimal=true)
[![Version](https://img.shields.io/npm/v/nuxt-aws-lambda.svg?style=flat-square)](https://www.npmjs.com/package/nuxt-aws-lambda)
[![License](https://img.shields.io/npm/l/nuxt-aws-lambda.svg?style=flat-square)](https://www.npmjs.com/package/nuxt-aws-lambda)
![Typescript](https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square)

Nuxt AWS Lambda Handler.

## Used With Serverless Framework

[Read Serverless Nuxt Documentation](https://github.com/wan2land/serverless-nuxt)

## Installation

```bash
npm i nuxt-aws-lambda
```

You can write Aws Lambda function like this: 

`handler.js`

```js
const { createNuxtHandler } = require('nuxt-aws-lambda')
const config = require('./nuxt.config.js')

module.exports.render = createNuxtHandler(config)
```
