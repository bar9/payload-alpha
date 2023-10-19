import express from 'express'
import payload from 'payload'
import dotenv from 'dotenv'

import testCredentials from './credentials'
import path from "path";

const app = express()

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
})

const globalSetup = async (): Promise<void> => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
  })

  app.listen(process.env.PORT, async () => {
    // console.log(`Express is now listening for incoming connections on port ${process.env.PORT}.`)
  })

  const response = await fetch(
    `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/users/first-register`,
    {
      body: JSON.stringify({
        email: testCredentials.email,
        password: testCredentials.password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
    },
  )

  const data = await response.json()

  if (!data.user || !data.user.token) {
    throw new Error('Failed to register first user')
  }
}

export default globalSetup
