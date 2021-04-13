import { Client, DMChannel, Message } from "discord.js"
import { readFile, writeFile } from "fs/promises"
import { getOAuth2Client, TOKEN_PATH } from "../utils"

export const name = 'auth-token'
export const execute = async (client: Client, message: Message, args: string[]) => {
    if (!(message.channel instanceof DMChannel)) {
        message.channel.send('Do not reveal your access token in public! Use this command in my DM')
        message.delete({ reason: 'Sensitive info shared accidentally' })
        return
    }
    const [channelId, code] = args
    
    try {
        const oAuth2Client = await getOAuth2Client(channelId)
        const token = await oAuth2Client.getToken(code)
        oAuth2Client.setCredentials(token.tokens)
        const content = await readFile(TOKEN_PATH)
        const json = JSON.parse(content.toString())
        json[channelId] = {}
        json[channelId]['oAuthToken'] = token.tokens
        await writeFile(TOKEN_PATH, JSON.stringify(json, null, 4))
        console.log('Token stored to', TOKEN_PATH)
        await message.author.send('Account successfully authenticated!')
    } 
    catch (err) {
        message.channel.send('Something went wrong...')
        console.log(err)
    }
}
