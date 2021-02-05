import Discord from 'discord.js'
import { authToken } from './utils'
import { readdir } from 'fs'

const client = new Discord.Client()

client.on('ready', () => {
    console.log('Bot is online!')
})

readdir(`${__dirname}/events`, (err, files) => {
    if (err) return console.log(err)
    files.forEach(file => {
		const fileArr = file.split('.')
		if (fileArr[1] == 'js' && fileArr[2] == 'map') return
		const event = require(`./events/${file}`)
		const eventName = fileArr[0]
		client.on(eventName, event.bind(null, client))
	})
})

client.commands = new Discord.Collection()

readdir(`${__dirname}/commands`, (err, files)=>{
	if (err) return console.error(err)
	files.forEach(file => {
		const fileArr = file.split('.')
		if (fileArr[1] == 'js' && fileArr[2] == 'map') return
		const command = require(`./commands/${file}`)
		client.commands.set(command.name, command)
	})
})

client.login(authToken)
