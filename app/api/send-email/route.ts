import { sendWelcomeEmail } from '@/actions/send-email/send-welcome'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  console.log(
    '---------------------------------------------------------------- Post API'
  )
  try {
    const { email, name } = await req.json()
    console.log('email: ', email)
    console.log('name: ', name)
    const response = sendWelcomeEmail(email, name)
    console.log('response: ', response)
    return NextResponse.json({ status: 200, message: 'Send successfully!' })
  } catch (error: any) {
    console.log('❌ Error fetching exams:', error)
    return NextResponse.json(
      { message: error.message || error },
      { status: 500 }
    )
  }
}
