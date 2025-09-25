'use server'

import 'dotenv/config'
import { SESv2Client, CreateEmailIdentityCommand } from '@aws-sdk/client-sesv2'

const ses = new SESv2Client({
  region: process.env.AWS_SES_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
    sessionToken: process.env.AWS_SECRET_TOKEN!,
  },
})

const email = 'kyxuan0000@gmail.com' // e.g. "user@gmail.com"

async function createEmailIdentity(email: string) {
  const cmd = new CreateEmailIdentityCommand({
    EmailIdentity: email, // e.g. admin@haxuan.link
  })
  const resp = await ses.send(cmd)
  console.log('✅ Email identity created:', resp)
}

createEmailIdentity(email).catch(console.error)
