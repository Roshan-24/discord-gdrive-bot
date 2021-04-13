import { Client, DMChannel, Message } from "discord.js"
import { readFile, writeFile } from "fs"
import { getOAuth2Client, TOKEN_PATH } from "../utils"

export const name = 'auth-token'
export const execute = async (client: Client, message: Message, args: string[]) => {
    if (!(message.channel instanceof DMChannel)) {
        message.channel.send('Do not reveal your access token in public! Use this command in my DM')
        message.delete({ reason: 'Sensitive info shared accidentally' })
        return
    }
    const [channelId, token] = args
    
    try {
        const oAuth2Client = await getOAuth2Client(channelId)
        oAuth2Client.getToken(token, (err: any, token: any) => {
            if (err) throw err
            oAuth2Client.setCredentials(token);
            readFile(TOKEN_PATH, (err, content) => {
                if (err) throw err
                const json = JSON.parse(content.toString())
                json[channelId] = {}
                json[channelId]['oAuthToken'] = token
                writeFile(TOKEN_PATH, JSON.stringify(json, null, 4), err => {
                    if (err) throw err
                    console.log('Token stored to', TOKEN_PATH);
                    message.author.send('Account successfully authenticated!')
                })
            })
        })
    } 
    catch (err) {
        message.channel.send('Something went wrong...')
        console.log(err)
    }
}
