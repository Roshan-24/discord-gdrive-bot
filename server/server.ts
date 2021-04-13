import express from 'express'
import path from 'path'
import { getOAuth2Client, getPageToken, getWebHookClient, savePageToken } from '../utils'
import { google } from 'googleapis'

const app = express()

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../server/index.html'))
})

app.post('/hook/:id', async (req, res) => {
    console.log('Received webhook')
    try {
        const auth = await getOAuth2Client(req.params.id == 'test' ? '829673653935407154' : req.params.id)
        const drive = google.drive({ version: 'v3', auth })
        const changesList = await drive.changes.list({
            pageToken: await getPageToken(req.params.id == 'test' ? '829673653935407154' : req.params.id),
            fields: 'newStartPageToken, changes(file(trashed, explicitlyTrashed, webViewLink, createdTime))' 
        })
        await savePageToken(changesList.data.newStartPageToken, req.params.id == 'test' ? '829673653935407154' : req.params.id)
        const type = changesList.data.changes.map(change => {
            const date = new Date(change.file.createdTime)
            const event = (change.file.trashed || change.file.explicitlyTrashed) ? 'Trashed' : 
                ((Math.abs(date.getTime() - Date.now()) < 2000) ? 'Created' : 'Viewed')
            console.log(event)
            return { event, webViewLink: change.file.webViewLink }
        })
        const hook = await getWebHookClient(req.params.id == 'test' ? '829673653935407154' : req.params.id)
        await hook.send({
            embeds: type.map(change => {
                if (change.event == 'Viewed') return
                return {
                    title: 'Change detected on Drive',
                    color: change.event == 'Created' ? '#00FF00' : '#FF0000',
                    description: change.event == 'Created' ? `A new file has been created ${change.webViewLink}` : 'A file has been deleted'
                }
            })
        })
        res.status(200).end()
    }
    catch (err) {
        console.log(err)
        res.status(200).end()
    }
})

export default app
