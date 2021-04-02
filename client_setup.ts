import { Client, Collection } from 'discord.js'
import { readdir } from 'fs'

export const setupClient = () => {

    const client = new Client()

    readdir(`${__dirname}/events`, (err, files) => {
        if (err) return console.log(err)
        files.forEach(file => {
            const fileArr = file.split('.')
            if (fileArr[1] == 'js' && fileArr[2] == 'map') return
            const event = require(`./events/${file}`)
            const eventName = fileArr[0]
            client.on(eventName, event.default.bind(null, client))
        })
    })

    client.commands = new Collection()

    readdir(`${__dirname}/commands`, (err, files)=>{
        if (err) return console.error(err)
        files.forEach(file => {
            const fileArr = file.split('.')
            if (fileArr[1] == 'js' && fileArr[2] == 'map') return
            const command = require(`./commands/${file}`)
            client.commands.set(command.name, command)
        })
    })

    return client
}