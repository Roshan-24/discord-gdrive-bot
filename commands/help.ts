import { Client, Message, MessageEmbed } from "discord.js"
import { prefix } from "../utils"

export const name = 'help'
export const execute = async (client: Client, message: Message) => {
    try {
        await message.channel.send(new MessageEmbed()
            .setColor('#FFFF00')
            .setTitle('Drive bot commands')
            .setDescription(`
                **${prefix}drive-init** - Initialize the bot with a google account for a channel\n
                **${prefix}auth-token <channelId> <authToken>** - To be used only in DM and only when the bot says you to. Authorize the bot with a google account\n
                **${prefix}list-files** - List the files in the drive\n
                **${prefix}watch-drive <number of days>** - Receive messages for file changes in the drive for specified number of days\n
                **${prefix}watch-drive:stop** - Stop receiving messages for file changes\n
                **${prefix}drive-deinit** - De-initialize drive integration for a channel
                **${prefix}ping** - Test the bot's status
            `)
        )
    } 
    catch (err) {
        console.log(err)
    }
}