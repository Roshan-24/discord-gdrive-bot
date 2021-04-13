import { User, WebhookClient } from 'discord.js'
import dotenv from 'dotenv'
import { readFile, writeFile } from 'fs/promises'
import { google } from 'googleapis'

dotenv.config()

export const authToken = process.env.BOT_TOKEN
export const prefix = '!'
export const TOKEN_PATH = 'tokens.json'
export const SCOPES = ['https://www.googleapis.com/auth/drive']

export const getOAuth2Client = async (channelId: string) => {
    try {
        const oAuth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URL
        )
    
        const tokens = await readFile(TOKEN_PATH)
        if (!Buffer.isBuffer(tokens)) return oAuth2Client
        const json = JSON.parse(tokens.toString())
        if (json[channelId] == null) json[channelId] = {}
        if (!json[channelId]['oAuthToken']) return oAuth2Client
        oAuth2Client.setCredentials(json[channelId]['oAuthToken'])
    
        return oAuth2Client
    }
    catch (err) {
        throw err
    }
}

export const saveHookData = async (channelId: string, hookId: string, token: string) => {
    try {
        const content = await readFile(TOKEN_PATH)
        if (!(content instanceof Buffer)) return null
        const json = JSON.parse(content.toString())
        json[channelId]['hookId'] = hookId
        json[channelId]['hookToken'] = token
        await writeFile(TOKEN_PATH, JSON.stringify(json))
    }
    catch (err) {
        throw err
    }
}

export const getWebHookClient = async (channelId: string) => {
    try {
        const content = await readFile(TOKEN_PATH)
        if (!(content instanceof Buffer)) return null
        const json = JSON.parse(content.toString())
        return new WebhookClient(json[channelId]['hookId'], json[channelId]['hookToken'])
    } 
    catch (err) {
        throw err
    }
}

export const checkInit = async (channelId: string) => {
    try {
        const content = await readFile(TOKEN_PATH)
        if (!(content instanceof Buffer)) return null
        const json = JSON.parse(content.toString())
        if (json[channelId] != null && json[channelId]['oAuthToken'] != null) return true
        return false
    }
    catch (err) {
        throw err
    }
}

export const savePageToken = async (pageToken: string, channelId: string) => {
    try {
        const content = await readFile(TOKEN_PATH)
        if (!(content instanceof Buffer)) return null
        const json = JSON.parse(content.toString())
        if (json[channelId] == null) throw new Error('Drive not initialized for channel')
        json[channelId]['pageToken'] = pageToken
        await writeFile(TOKEN_PATH, JSON.stringify(json))
    } 
    catch (err) {
        throw err
    }
}

export const getPageToken = async (channelId: string) => {
    try {
        const content = await readFile(TOKEN_PATH)
        if (!(content instanceof Buffer)) return null
        const json = JSON.parse(content.toString())
        if (json[channelId] == null) throw new Error('Drive not initialized for channel')
        return json[channelId]['pageToken']
    } 
    catch (err) {
        throw err
    }
}

export const saveWatchData = async (resourceId: string, expirationTime:string, channelId: string) => {
    try {
        const content = await readFile(TOKEN_PATH)
        if (!(content instanceof Buffer)) return null
        const json = JSON.parse(content.toString())
        if (json[channelId] == null) throw new Error('Drive not initialized for channel')
        json[channelId]['resourceId'] = resourceId
        json[channelId]['expirationTime'] = expirationTime
        await writeFile(TOKEN_PATH, JSON.stringify(json))
    } 
    catch (err) {
        throw err
    }
}

export const getWatchData = async (channelId: string) => {
    try {
        const content = await readFile(TOKEN_PATH)
        if (!(content instanceof Buffer)) return null
        const json = JSON.parse(content.toString())
        if (json[channelId] == null) throw new Error('Drive not initialized for channel')
        if (json[channelId]['resourceId'] == null || json[channelId]['expirationTime'] == null) return null
        return { resourceId: json[channelId]['resourceId'], expirationTime: json[channelId]['expirationTime'] }
    } 
    catch (err) {
        throw err
    }
}
