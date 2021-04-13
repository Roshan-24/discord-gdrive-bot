import { Client, Guild, MessageEmbed, TextChannel } from "discord.js"
import { prefix } from "../utils"

export default async (client: Client, guild: Guild) => {
    try {
        const channel = guild.systemChannel ?? guild.channels.cache.filter(ch => ch instanceof TextChannel)[0]
        await channel.send(new MessageEmbed()
            .setDescription(`
                Hello! My name is Obama, the 44th president of the United States\n
                Other than that, you can use me to enable google drive integration in one of your text channels and do all sorts of cool stuff like watch for file changes and listing files\n
                To get started, type ${prefix}help
            `)
            .setColor('#FFFF00')
        )
    } 
    catch (err) {
        console.log(err)
    }
}