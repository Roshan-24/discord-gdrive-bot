import express from 'express'
import path from 'path'
import { getOAuth2Client, getWebHookClient } from '../utils'
import { google } from 'googleapis'

const app = express()

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../server/index.html'))
})

app.post('/hook/:id', async (req, res) => {
    const auth = await getOAuth2Client(req.params.id)
    const drive = google.drive({ version: 'v3', auth })
    const changesList = await drive.changes.list({
        pageToken: (await drive.changes.getStartPageToken()).data.startPageToken,
        fields: 'newStartPageToken, changes(file(trashed, explicitlyTrashed, webViewLink, createdTime))' 
    })
    const type = changesList.data.changes.map(change => {
        const date = new Date(change.file.createdTime)
        const event = (change.file.trashed || change.file.explicitlyTrashed) ? 'Trashed' : 
            ((Math.abs(date.getTime() - Date.now()) < 100) ? 'Created' : 'Viewed')
        return { event, webViewLink: change.file.webViewLink }
    })
    const hook = await getWebHookClient(req.params.id)
    hook.send({
        embeds: type.map(change => ({
            title: 'Change detected on Drive',
            description: change.event == 'Created' ? `A new file has been created ${change.webViewLink}` : 'A file has been deleted'
        }))
    })
    res.status(200).end()
})

export default app
