# Serverless Nuxt

Serverless Nuxt

<p>
  <a href="https://npmcharts.com/compare/serverless-nuxt?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/serverless-nuxt.svg" /></a>
  <a href="https://www.npmjs.com/package/serverless-nuxt"><img alt="Version" src="https://img.shields.io/npm/v/serverless-nuxt.svg" /></a>
  <a href="https://www.npmjs.com/package/serverless-nuxt"><img alt="License" src="https://img.shields.io/npm/l/serverless-nuxt.svg" /></a>
  <br />
  <a href="https://david-dm.org/corgidisco/serverless-nuxt"><img alt="dependencies Status" src="https://david-dm.org/corgidisco/serverless-nuxt/status.svg" /></a>
  <a href="https://david-dm.org/corgidisco/serverless-nuxt?type=dev"><img alt="devDependencies Status" src="https://david-dm.org/corgidisco/serverless-nuxt/dev-status.svg" /></a>
  <br />
  <a href="https://www.npmjs.com/package/serverless-nuxt"><img alt="NPM" src="https://nodei.co/npm/serverless-nuxt.png" /></a>
</p>

## Installation

기존에 Nuxt 프로젝트가 없다면 먼저 생성해줍니다. 이미 만들어진 Nuxt 프로젝트가 있다면 다음 내용은 생략해도 좋습니다.

[Nuxt 프로젝트 생성하기](https://nuxtjs.org/guide/installation/)

Nuxt 프로젝트내에서 패키지를 설치합니다.

```bash
npm i serverless-nuxt
```

패키지를 설치한 후, **serverless.yml** 파일을 추가합니다. `serverless-nuxt-example` 부분은 본인의 프로젝트 이름으로 설정합니다.
클라우드포메이션을 사용하여 `assets` 파일들을 S3 저장소에 업로드합니다. 만약에 이미 만들어놓은 S3 저장소가 있다면 `resources`에 해당하는 부분은 삭제해주시면 됩니다.

플러그인 설정은 `custom.nuxt` 필드에 작성합니다. 자세한 옵션은 여기를 참고해주세요.

```yml
service:
  name: serverless-nuxt-example

plugins:
  - serverless-nuxt/plugin

resources:
  Resources:
    AssetsBucket:
      Type: AWS::S3::Bucket
      Properties:
        BucketName: ${self:custom.nuxt.bucketName}

provider:
  name: aws
  stage: ${opt:stage, 'dev'}
  runtime: nodejs8.10
  environment:
    NODE_ENV: ${file(.env.${self:provider.stage}.yml):NODE_ENV}

custom:
  nuxt:
    version: v0.0.1-alpha
    bucketName: serverless-nuxt-example-${self:provider.stage}

functions:
  nuxt:
    handler: handler.render
    events:
      - http: ANY /
      - http: ANY /{proxy+}
```

기존의 Nuxt 설정파일(`nuxt.config.js`)은 다음 형식에 맞춰서 조금만 수정하시면 됩니다.

```js
const pkg = require("./package.json")

// `export default` 형식으로 되어있다면 `module.exports =` 으로 변경해야합니다.
module.exports = {
  mode: "universal",
  head: {
    title: pkg.name,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: pkg.description },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
    ],
  },
  build: {
    // publicPath 값은 플러그인이 서버 설정에 맞춰서 자동 생성합니다.
  },
}
```

마지막으로 핸들러(`handler.js`는 다음과 같이 작성합니다.

```js
const { createNuxtApp } = require("serverless-nuxt")
const config = require("./nuxt.config.js")

module.exports.render = createNuxtApp(config)
```

배포는 다음과 같이 진행하시면 됩니다. 배포시에 서버리스 플러그인이 자동으로 빌드합니다.

```bash
sls deploy --stage dev
```

## Option

```yml
custom:
  nuxt:
    version: v1.0.0-alpha
    bucketName:
    bucketPrefix:
    assetsPath:
```

Name                 | Description | Default
---------------------| ----------- | ------- |
version (required)   | version     |
bucketName (required)| AWS S3 Bucket Name for static files
bucketPrefix         |  | `""`
assetsPath           |  | `".nuxt/dist/client"`


## References

- [Serverless plugin author's cheat sheet](https://gist.github.com/HyperBrain/50d38027a8f57778d5b0f135d80ea406)

## License

MIT
