import { Client, Message } from "discord.js"
import { readFile, writeFile } from "fs"
import { getOAuth2Client, TOKEN_PATH } from '../utils'

export default async (client: Client, message: Message, command: string, args: string[]) => {
    if (command == 'auth-token') {
        const token = args[0]
        const oAuth2Client = await getOAuth2Client(message.author)
        oAuth2Client.getToken(token, (err: any, token: any) => {
			if (err)
				return console.error('Error retrieving access token', err);
			oAuth2Client.setCredentials(token);
            readFile(TOKEN_PATH, (err, content) => {
                if (err) {
                    console.log(err)
                    return
                }
                const json = JSON.parse(content.toString())
                json[message.author.id] = token
                writeFile(TOKEN_PATH, JSON.stringify(json, null, 4), (err) => {
                    if (err) return console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                    message.author.send('Account successfully authenticated!')
                });
            })
		});
    }
}