'use server'

import { render } from '@react-email/render'
import {
  ListContactListsCommand,
  SESv2Client,
  SendEmailCommand,
} from '@aws-sdk/client-sesv2'
import WelcomeEmail from '@/email/welcome/welcome'

const ses = new SESv2Client({
  region: process.env.AWS_SES_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
    sessionToken: process.env.AWS_SECRET_TOKEN!,
  },
})

export async function sendWelcomeEmail(toEmail: string, name: string) {
  const emailHtml = await render(WelcomeEmail({ name }))

  const params = {
    FromEmailAddress: `${process.env.SENDER_EMAIL}`, // Must be verified in SES
    Content: {
      Simple: {
        Subject: { Data: 'Welcome to Our Platform' },
        Body: {
          Html: { Data: emailHtml },
        },
      },
    },
    Destination: {
      ToAddresses: [toEmail],
    },
  }

  const command = new SendEmailCommand(params)
  const response = await ses.send(command)
  return response
}
