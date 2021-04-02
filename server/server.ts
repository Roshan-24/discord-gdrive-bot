import express from 'express'

const app = express()

app.post('/hook', (req, res) => {
    console.log(req.body)
    res.status(200).end()
})

export default app
