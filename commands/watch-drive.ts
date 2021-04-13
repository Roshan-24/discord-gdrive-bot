import { Client, Message, TextChannel } from "discord.js"
import { google } from "googleapis"
import path from "path"
import { getOAuth2Client, getWatchData, saveHookData, savePageToken, saveWatchData } from "../utils"

// [prefix] !watch-drive <no.of days from expiration>

export const name = 'watch-drive'
export const execute = async (client: Client, message: Message, args: string[]) => {
    try {
        if (!(message.channel instanceof TextChannel)) {
            await message.channel.send('You\'re supposed to use this command in a server\'s text channel')
            return
        }

        if (args[0] == null) {
            await message.channel.send('You need to specify the number of days to watch for changes')
            return
        }

        const id = message.channel.id
        if (await getWatchData(id)) {
            await message.channel.send('You are already watching for file changes')
            return
        }

        const auth = await getOAuth2Client(id)
        const drive = google.drive({version: 'v3', auth})
        const startPageToken = (await drive.changes.getStartPageToken()).data.startPageToken
        await savePageToken(startPageToken, id)
        const expirationTime = (Date.now() + Number(args[0])*24*3600*1000).toString()

        const res = await drive.changes.watch({
            pageToken: startPageToken,
            requestBody: {
                kind: 'api#channel',
                id: `channel-${id}`,
                address: `https://discord-gdrive-bot.herokuapp.com/hook/${id}`,
                expiration: expirationTime,
                type: 'web_hook'
            }
        })

        console.log(res)
        await saveWatchData(res.data.resourceId, expirationTime, id)

        const hook = await message.channel.createWebhook('Obama', {
            avatar: path.join(__dirname, '../../obama.jpg'),
            reason: 'To send drive changes notifications'
        })
        await saveHookData(message.channel.id, hook.id, hook.token)

        await message.channel.send(`Watching drive changes for the next ${args[0]} days`)
    } 
    catch (err) {
        message.channel.send('There was some error')
        console.log(err)
    }
}
