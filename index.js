'use strict'

require('dotenv').config({ path: 'variables.env' });
const APIAI_TOKEN = process.env.APIAI_TOKEN;
const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;

const express = require('express')
const app = express()
const apiai = require('apiai')(APIAI_TOKEN)

app.use(express.static(__dirname + '/views'))
app.use(express.static(__dirname + '/public'))

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env)
})

const io = require('socket.io')(server)
io.on('connection', function(socket) {
  console.log('A user connected')
})

// Web UI
app.get('/', (req, res) => {
  res.sendFile('index.html')
})

io.on('connection', function(socket) {
  socket.on('chat message', (text) => {
    // get a reply from API.AI
    let apiaiReq = apiai.textRequest(text, {
      sessionId: APIAI_SESSION_ID
    })

    apiaiReq.on('response', (response) => {
      let aiText = response.result.fulfillment.speech
      socket.emit('bot reply', aiText)
    })

    apiaiReq.on('error', (err) => {
      console.log(err)
    })

    apiaiReq.end()

  })
})
