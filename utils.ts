import dotenv from 'dotenv'

dotenv.config()

export const authToken = process.env.BOT_TOKEN
export const prefix = '!'