import { Client, Message } from 'discord.js'

//[prefix]ping

export const name = 'ping';
export const execute = (client: Client, message: Message) => {
    message.channel.send('sup');
}