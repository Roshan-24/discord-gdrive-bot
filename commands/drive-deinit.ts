import { Client, Message } from "discord.js"
import { readFile, writeFile } from "fs/promises"
import { TOKEN_PATH } from "../utils"

export const name = 'drive-deinit'
export const execute = async (client: Client, message: Message) => {
    try {
        const content = await readFile(TOKEN_PATH)
        if (!(content instanceof Buffer)) return null
        const json = JSON.parse(content.toString())
        if (json[message.channel.id] == null) {
            await message.channel.send('You have not enabled drive integration for this channel')
            return
        }
        if (json[message.channel.id]['resourceId'] != null || json[message.channel.id]['expirationTime'] != null) {
            await message.channel.send('You need to first stop watching for changes before de-initializaing drive integration')
            return
        }
        delete json[message.channel.id]
        await writeFile(TOKEN_PATH, JSON.stringify(json))
        await message.channel.send('Drive integration de-initialized successfully for this channel')
    } 
    catch (err) {
        console.log(err)
    }
}