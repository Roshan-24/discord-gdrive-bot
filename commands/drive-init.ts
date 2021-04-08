import { Client, Message, TextChannel } from 'discord.js';
import { SCOPES, getOAuth2Client, checkInit } from '../utils';

//[prefix]drive-init

export const name = 'drive-init';
export const execute = async (client: Client, message: Message) => {
	if (!(message.channel instanceof TextChannel)) {
		message.channel.send('You\'re supposed to use this command in a server\'s text channel')
		return
	}
	
	if (await checkInit(message.channel.id)) {
		message.channel.send('You have already enabled drive integration for this channel!')
		return
	}

	const oAuth2Client = await getOAuth2Client(message.channel.id)
	
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});
	message.channel.send("Check your DMs!")
	message.author.send(`You have initiated drive integration for channel id ${message.channel.id}. Authorize the bot by visiting this url: ${authUrl} and copy the access code and reply back in this format - '!auth-token <channel-id> <token>' (without the brackets). Caution: Don't share your access token with others`);
}
