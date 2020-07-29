# Use Custom URL instead of S3 Bucket URL

[READ AWS Document](https://docs.aws.amazon.com/AmazonS3/latest/dev/VirtualHosting.html#virtual-hosted-style-access).

Get a certificate using AWS ACM. Regions must be set to "US East 1"(N Virginia, us-east-1).

For example, `cdn.dev.my-nuxt-project.com`, `cdn.my-nuxt-project.com`.

`.env-cmdrc.js`

```js
module.exports = {
  local: {
    NODE_ENV: 'development',
    PORT: '8080',
  },
  dev: {
    DOMAIN_NAME: 'dev.my-nuxt-project.com',
    NODE_ENV: 'development',
    NUXT_TELEMETRY_DISABLED: '1',

    DOMAIN_HOSTED_ZONE: 'my-nuxt-project.com.', // tailing dot
    ASSETS_DOMAIN_NAME: 'cdn.dev.my-nuxt-project.com',
    ASSETS_ACM_ARN: 'arn:aws:acm:us-east-1:000000000000:certificate/00000000-0000-0000-0000-000000000000', // copy ACM Arn
  },
  prod: {
    DOMAIN_NAME: 'my-nuxt-project.com',
    NODE_ENV: 'production',
    NUXT_TELEMETRY_DISABLED: '1',

    DOMAIN_HOSTED_ZONE: 'my-nuxt-project.com.', // tailing dot
    ASSETS_DOMAIN_NAME: 'cdn.my-nuxt-project.com',
    ASSETS_ACM_ARN: 'arn:aws:acm:us-east-1:000000000000:certificate/00000000-0000-0000-0000-000000000000', // copy ACM Arn
  },
}
```

`serverless.yml`

```yml
custom:
    # ... (skip)
  nuxt:
    version: v${file(./package.json):version}
    bucketName: my-nuxt-project-${self:provider.stage}
    cdnPath: https://${env:ASSETS_DOMAIN_NAME}

resources:
  Resources:
    # ... (skip)
    AssetsCloudFrontDistribution:
      Type: AWS::CloudFront::Distribution
      Properties:
        DistributionConfig:
          Enabled: true
          Aliases:
            - ${env:ASSETS_DOMAIN_NAME}
          Origins:
            - DomainName: !GetAtt AssetsBucket.DomainName
              Id: AssetsBucket
              CustomOriginConfig:
                OriginProtocolPolicy: match-viewer
          DefaultCacheBehavior:
            AllowedMethods:
              - DELETE
              - GET
              - HEAD
              - OPTIONS
              - PATCH
              - POST
              - PUT
            TargetOriginId: AssetsBucket
            ForwardedValues:
              QueryString: false
            ViewerProtocolPolicy: allow-all
          IPV6Enabled: true
          ViewerCertificate:
            AcmCertificateArn: ${env:ASSETS_ACM_ARN}
            SslSupportMethod: sni-only
    AssetsRoute53ARecord:
      Type: AWS::Route53::RecordSet
      Properties:
        HostedZoneName: ${env:DOMAIN_HOSTED_ZONE}
        Name: ${env:ASSETS_DOMAIN_NAME}
        Type: A
        AliasTarget:
          DNSName: !GetAtt AssetsCloudFrontDistribution.DomainName
          HostedZoneId: Z2FDTNDATAQYW2
    AssetsRoute53AAAARecord:
      Type: AWS::Route53::RecordSet
      Properties:
        HostedZoneName: ${env:DOMAIN_HOSTED_ZONE}
        Name: ${env:ASSETS_DOMAIN_NAME}
        Type: AAAA
        AliasTarget:
          DNSName: !GetAtt AssetsCloudFrontDistribution.DomainName
          HostedZoneId: Z2FDTNDATAQYW2
```
