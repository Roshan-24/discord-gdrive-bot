import { Client, Message } from 'discord.js'

export const name = 'ping';
export function execute(client: Client, message: Message) {
    message.channel.send('sup');
}