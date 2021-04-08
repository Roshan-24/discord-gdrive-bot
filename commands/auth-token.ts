import { Client, DMChannel, Message } from "discord.js"
import { readFile, writeFile } from "fs"
import { getOAuth2Client, TOKEN_PATH } from "../utils"

export const name = 'auth-token'
export const execute = async (client: Client, message: Message, args: string[]) => {
    if (!(message.channel instanceof DMChannel)) {
        message.channel.send('Do not reveal your access token in the public! Use this command in my DMs')
        message.delete({ reason: 'Sensitive info shared accidentally' })
        return
    }
    const [channelId, token] = args
    const oAuth2Client = await getOAuth2Client(channelId)
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
            json[channelId] = {}
            json[channelId]['oAuthToken'] = token
            writeFile(TOKEN_PATH, JSON.stringify(json, null, 4), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
                message.author.send('Account successfully authenticated!')
            });
        })
    });
}
