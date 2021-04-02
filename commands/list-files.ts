import { Client, Message } from "discord.js"
import { google } from "googleapis";
import { getOAuth2Client } from "../utils";

export const name = 'list-files'
export const execute = async (client: Client, message: Message) => {
    const auth = await getOAuth2Client(message.author)
    const drive = google.drive({version: 'v3', auth});
    drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
    },
    (err, res) => {
        if (err) return message.channel.send('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length) {
            message.channel.send('Files:');
            files.map((file) => {
            message.channel.send(`${file.name} (${file.id})`);
            });
        } else {
            message.channel.send('No files found.');
        }
    });
}