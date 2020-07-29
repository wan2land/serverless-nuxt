# Redirect www URLs to non-www

`.env-cmdrc.js`

```js
module.exports = {
  local: {
    NODE_ENV: 'development',
    PORT: '8080',
  },
  dev: {
    DOMAIN_NAME: 'dev.my-nuxt-project.com',
    REDIRECT_DOMAIN_NAME: 'www.dev.my-nuxt-project.com',
    NODE_ENV: 'development',
    NUXT_TELEMETRY_DISABLED: '1',

    DOMAIN_HOSTED_ZONE: 'my-nuxt-project.com.', // tailing dot
  },
  prod: {
    DOMAIN_NAME: 'my-nuxt-project.com',
    REDIRECT_DOMAIN_NAME: 'www.my-nuxt-project.com',
    NODE_ENV: 'production',
    NUXT_TELEMETRY_DISABLED: '1',

    DOMAIN_HOSTED_ZONE: 'my-nuxt-project.com.', // tailing dot
  },
}
```

`serverless.yml`

```yml
resources:
  Resources:
    # ... (skip)
    RedirectBucket:
      Type: AWS::S3::Bucket
      Properties:
        BucketName: ${env:REDIRECT_DOMAIN_NAME}
        WebsiteConfiguration:
          RedirectAllRequestsTo:
            HostName: ${env:DOMAIN_NAME}
            Protocol: https
    RedirectRoute53ARecord:
      Type: AWS::Route53::RecordSet
      Properties:
        HostedZoneName: ${env:DOMAIN_HOSTED_ZONE}
        Name: ${env:REDIRECT_DOMAIN_NAME}
        Type: A
        AliasTarget:
          DNSName: s3-website.ap-northeast-2.amazonaws.com
          HostedZoneId: Z3W03O7B5YMIYP
          EvaluateTargetHealth: false
    RedirectRoute53AAAARecord:
      Type: AWS::Route53::RecordSet
      Properties:
        HostedZoneName: ${env:DOMAIN_HOSTED_ZONE}
        Name: ${env:REDIRECT_DOMAIN_NAME}
        Type: AAAA
        AliasTarget:
          DNSName: s3-website.ap-northeast-2.amazonaws.com
          HostedZoneId: Z3W03O7B5YMIYP
          EvaluateTargetHealth: false

```
