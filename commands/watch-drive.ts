import { Client, Message, TextChannel } from "discord.js"
import { google } from "googleapis"
import path from "path"
import { getOAuth2Client, saveHookData } from "../utils"

// [prefix] !watch-drive <no.of days from expiration>

export const name = 'watch-drive'
export const execute = async (client: Client, message: Message, args: string[]) => {

    if (!(message.channel instanceof TextChannel)) {
        message.channel.send('You\'re supposed to use this command in a server\'s text channel')
		return
    }

    const id = message.channel.id
    const auth = await getOAuth2Client(id)
    const drive = google.drive({version: 'v3', auth})
    const startPageToken = (await drive.changes.getStartPageToken()).data.startPageToken

    try {
        const res = await drive.changes.watch({
            pageToken: startPageToken,
            requestBody: {
                id: `channel-${id}`,
                address: `https://discord-gdrive-bot.herokuapp.com/hook/${id}`,
                expiration: (Date.now() + Number(args[0])*24*3600*1000).toString(),
                type: 'web_hook'
            }
        })

        const hook = await message.channel.createWebhook('Obama', {
            avatar: path.join(__dirname, '../../obama.jpg'),
            reason: 'To send drive changes notifications'
        })
        await saveHookData(message.channel.id, hook.id, hook.token)

        message.channel.send(`Watching drive changes for the next ${args[0]} days`)
    } 
    catch (err) {
        message.channel.send('There was some error')
        console.log(err)
    }
}
