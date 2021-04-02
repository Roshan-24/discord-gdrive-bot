import express from 'express'
import path from 'path'

const app = express()

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../server/index.html'))
})

app.post('/hook', (req, res) => {
    console.log(req.body)
    res.status(200).end()
})

export default app
