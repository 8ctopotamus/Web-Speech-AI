const socket = io()
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()
recognition.lang = 'en-US'
recognition.interimResults = false

document.querySelector('button').addEventListener('click', () => {
  recognition.start()
})

// Once speech recognition has started, use the result event to retrieve what was said as text:
recognition.addEventListener('result', (e) => {
  let last = e.results.length - 1
  let text = e.results[last][0].transcript

  console.log('Confidence: ' + e.results[0][0].confidence)
  socket.emit('chat message', text)
})

function synthVoice(text) {
  const synth = window.speechSynthesis
  const utterance = new SpeechSynthesisUtterance()
  utterance.text = text
  synth.speak(utterance)
}

socket.on('bot reply', function(replyText) {
  synthVoice(replyText)
})
