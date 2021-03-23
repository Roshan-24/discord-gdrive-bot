import { User } from 'discord.js'
import dotenv from 'dotenv'
import { readFile } from 'fs/promises'
import { google } from 'googleapis'

dotenv.config()

export const authToken = process.env.BOT_TOKEN
export const prefix = '!'
export const TOKEN_PATH = 'tokens.json'
export const SCOPES = ['https://www.googleapis.com/auth/drive'];

export const getOAuth2Client = async (user: User) => {
    const content = await readFile('credentials.json').catch(err => console.log(err))
    if (!Buffer.isBuffer(content)) return null
    const {
        client_secret,
        client_id,
        redirect_uris,
    } = JSON.parse(content.toString()).installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
    );

    const tokens = await readFile(TOKEN_PATH).catch(err => console.log(err))
    if (!Buffer.isBuffer(tokens)) return oAuth2Client
    const json = JSON.parse(tokens.toString())
    if (!json[user.id]) return oAuth2Client
    oAuth2Client.setCredentials(json[user.id])

    return oAuth2Client
}