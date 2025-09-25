'use server'

import 'dotenv/config'
import { SESv2Client, CreateEmailIdentityCommand } from '@aws-sdk/client-sesv2'
import {
  Route53Client,
  ChangeResourceRecordSetsCommand,
} from '@aws-sdk/client-route-53'

const domain = process.env.DOMAIN!
const hostedZoneId = process.env.HOSTED_ZONE_ID

const ses = new SESv2Client({
  region: process.env.AWS_SES_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
    sessionToken: process.env.AWS_SECRET_TOKEN!,
  },
})

const route53 = new Route53Client({
  region: process.env.AWS_SES_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
    sessionToken: process.env.AWS_SECRET_TOKEN!,
  },
})

async function setupSesIdentity() {
  const createResp = await ses.send(
    new CreateEmailIdentityCommand({
      EmailIdentity: domain,
      DkimSigningAttributes: { NextSigningKeyLength: 'RSA_2048_BIT' },
    })
  )
  console.log('✅ SES Identity created:', createResp)

  const dkimTokens = createResp.DkimAttributes?.Tokens ?? []

  const changes: any[] = []

  dkimTokens.forEach((token: string) => {
    changes.push({
      Action: 'UPSERT',
      ResourceRecordSet: {
        Name: `${token}._domainkey.${domain}.`,
        Type: 'CNAME',
        TTL: 1800,
        ResourceRecords: [{ Value: `${token}.dkim.amazonses.com` }],
      },
    })
  })

  const route53Resp = await route53.send(
    new ChangeResourceRecordSetsCommand({
      HostedZoneId: hostedZoneId,
      ChangeBatch: { Changes: changes },
    })
  )

  console.log('✅ Route 53 records created:', route53Resp)
}

setupSesIdentity().catch((err) => {
  console.error('❌ Error:', err)
})
