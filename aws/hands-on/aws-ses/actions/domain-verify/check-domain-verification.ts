'use server'

import 'dotenv/config'
import { SESv2Client, GetEmailIdentityCommand } from '@aws-sdk/client-sesv2'

const client = new SESv2Client({
  region: process.env.AWS_SES_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
    sessionToken: process.env.AWS_SECRET_TOKEN!,
  },
})

const domain = process.env.DOMAIN!

async function checkDomainVerification(domain: string) {
  const command = new GetEmailIdentityCommand({ EmailIdentity: domain })
  const response = await client.send(command)

  if (!response.VerifiedForSendingStatus) {
    console.log(`❌ Domain ${domain} is NOT verified.`)
  } else {
    console.log(`✅ Domain ${domain} is verified.`)
  }

  console.log('Full response:', response)
}

checkDomainVerification(domain)
