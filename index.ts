import { authToken } from './utils'
import  { setupClient } from './client_setup'
import app from './server/server'

const client = setupClient()

client.on('ready', () => {
    console.log('Bot is online!')
})

client.login(authToken)

app.listen(process.env.PORT, () => {
	console.log('Server is running!')
})
