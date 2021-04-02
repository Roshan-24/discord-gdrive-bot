import { Client, Message } from "discord.js"
import { google } from 'googleapis'
import { createReadStream } from 'fs'
import { getOAuth2Client } from "../utils"
import path from 'path'

export const name = 'upload-file'
export const execute = async (client: Client, message: Message, args: string[]) => {
    const auth = await getOAuth2Client(message.author)
    const drive = google.drive({version: 'v3', auth});
    try {
        const res = await drive.files.create({
            requestBody: {
                name: 'obama.jpg',
                mimeType: 'image/jpg'
            },
            media: {
                mimeType: 'image/jpg',
                body: createReadStream(path.join(__dirname, 'obama.jpg'))
            }
        })
        console.log(res.data)
    } catch (err) {
        console.log(err)
    }
}