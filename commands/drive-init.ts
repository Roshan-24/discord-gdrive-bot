import { Client, Message } from 'discord.js';
import { SCOPES, getOAuth2Client } from '../utils';

//[prefix]drive-init

export const name = 'drive-init';
export const execute = async (client: Client, message: Message) => {
	const user = message.author;
	const oAuth2Client = await getOAuth2Client(user)
	
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});
	message.channel.send("Check your DMs!")
	message.author.send(`Authorize the bot by visiting this url: ${authUrl} and copy the access code and DM me in this format - !auth-token <token> (without the brackets). !!Dont share this with anyone else!!`);
}
