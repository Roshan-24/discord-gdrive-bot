import { Message, Client } from 'discord.js'
import { prefix } from '../utils'
import handleDm from './handle-dm'

export default (client: Client, message: Message) => {

    if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const command = args.shift()!.toLowerCase()

    if (message.channel.type == 'dm') {
        handleDm(client, message, command, args)
        return
    }
    
    const cmd = client.commands.get(command)

    if(!cmd) return
    
    cmd.execute(client,message,args)
}
