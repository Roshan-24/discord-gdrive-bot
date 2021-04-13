import { Client, Message, MessageEmbed } from "discord.js"
import { google } from "googleapis";
import { getOAuth2Client } from "../utils";

export const name = 'list-files'
export const execute = async (client: Client, message: Message) => {
    try {
        const auth = await getOAuth2Client(message.channel.id)
        const drive = google.drive({version: 'v3', auth})
        const res = await drive.files.list({
            pageSize: 10,
            fields: 'nextPageToken, files(name, webViewLink)'
        })
        const files = res.data.files
        if (files.length) {
            await message.channel.send(new MessageEmbed()
                .setTitle('Files:')
                .setDescription(files.map(file => `[${file.name}](${file.webViewLink})`))
                .setColor('#00FF00')
            )
        } else {
            await message.channel.send(new MessageEmbed()
                .setTitle('No files found')
                .setColor('#FF0000')
            )
        }
    }
    catch (err) {
        message.channel.send('Something went wrong...')
        console.log(err)
    }
}