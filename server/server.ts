import express from 'express'
import path from 'path'

import { WebhookClient } from 'discord.js'

const app = express()

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../server/index.html'))
})

app.post('/hook', (req, res) => {
    const hook = new WebhookClient("827587617591132170", "HB4-25v1SvD2aR31PWMVTm2-GWYCfBiEXYxhneu89PsM2KVmsV2fmh3vAQNa73TsZrYD")
    
    res.status(200).end()
})

export default app
