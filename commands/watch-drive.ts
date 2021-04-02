import { Client, Message } from "discord.js"
import { google } from "googleapis"
import { getOAuth2Client } from "../utils"

export const name = 'watch-drive'
export const execture = async (client: Client, message: Message, args: string[]) => {
    const auth = await getOAuth2Client(message.author)
    const drive = google.drive({version: 'v3', auth});
    drive.changes.watch()
}