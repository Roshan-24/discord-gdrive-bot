import { Client, Message, MessageEmbed, TextChannel } from 'discord.js';
import { SCOPES, getOAuth2Client, checkInit, prefix } from '../utils';

//[prefix]drive-init

export const name = 'drive-init';
export const execute = async (client: Client, message: Message) => {
	if (!(message.channel instanceof TextChannel)) {
		message.channel.send('You\'re supposed to use this command in a server\'s text channel')
		return
	}
	
	try {
		if (await checkInit(message.channel.id)) {
			message.channel.send('You have already enabled drive integration for this channel!')
			return
		}
	
		const oAuth2Client = await getOAuth2Client(message.channel.id)
		
		const authUrl = oAuth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: SCOPES,
		})
		await message.channel.send("Check your DMs!")
		await message.author.send(new MessageEmbed()
			.setColor('#FFFF00')
			.setTitle('Drive initialization')
			.setDescription(`You have started drive initialization for channel id ${message.channel.id}. Authorize the bot by clicking the link above and reply back in the following format:\n ${prefix}auth-token <channelId> <authToken>\n\n Caution: Do not share your access token with anybody`)
			.setURL(authUrl)
		)
	} 
	catch (err) {
		message.channel.send('Something went wrong...')
		console.log(err)
	}
}
