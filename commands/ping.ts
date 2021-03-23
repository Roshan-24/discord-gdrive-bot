import { Client, Message } from 'discord.js'

//[prefix]ping

export const name = 'ping';
export const execute = async (client: Client, message: Message) => {
    try {
        await message.channel.send('Sup')
    } catch (err) {
        console.log(err)
    }
}