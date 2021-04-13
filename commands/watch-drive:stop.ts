import { Client, Message } from "discord.js"
import { google } from "googleapis"
import { getOAuth2Client, getWatchData, getWebHookClient, saveHookData, saveWatchData } from "../utils"

export const name = 'watch-drive:stop'
export const execute = async (client: Client, message: Message) => {
    try {
        const auth = await getOAuth2Client(message.channel.id)
        const drive = google.drive({version: 'v3', auth})
        const watchData = await getWatchData(message.channel.id)
        const hook = await getWebHookClient(message.channel.id)
        if (watchData == null) {
            message.channel.send('You have not started watching for drive changes yet!')
            return
        }
        const res = await drive.channels.stop({
            'requestBody': {
                id: `channel-${message.channel.id}`,
                resourceId: watchData.resourceId,
                expiration: watchData.expirationTime
            }
        })
        await saveWatchData(null, null, message.channel.id)
        await saveHookData(message.channel.id, null, null)
        if (res.status == 204) {
            await hook.delete()
            await message.channel.send('Stopped watching changes in this channel')
        } else {
            console.log('Error boi')
        }
    } catch (err) {
        console.log(err)
        await message.channel.send('There was some error').catch(_err => console.log('There was some error'))
    }
}