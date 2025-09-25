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

const userEmail = 'kyxuan0000@gmail.com' // e.g. "user@gmail.com"

async function checkEmailVerification(address: string) {
  try {
    const command = new GetEmailIdentityCommand({ EmailIdentity: address })
    const response = await client.send(command)

    if (response.VerifiedForSendingStatus) {
      console.log(`✅ Email "${address}" is verified and can send mail.`)
    } else {
      console.log(`❌ Email "${address}" is NOT yet verified.`)
      console.log('👉 Check your inbox for the AWS SES verification email.')
    }

    console.log('Full response:', JSON.stringify(response, null, 2))
  } catch (err) {
    console.error(`⚠️ Error checking email identity "${address}":`, err)
  }
}

checkEmailVerification(userEmail)
