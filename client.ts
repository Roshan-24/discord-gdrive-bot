import { authToken } from './utils'
import  { setupClient } from './client_setup'

const client = setupClient()

client.on('ready', () => {
    console.log('Bot is online!')
})

client.login(authToken)
