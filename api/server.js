const express = require('express');
const app = express();
const emojis = require('./src/emojis.json')
const emojid = emojis[Math.floor(emojis.length*Math.random())]

const PORT = process.env.PORT || 80;

function shutdown(signal) {
  console.info(`Recieved ${signal}; Shutting down...`)
  return process.exit(0);
}

process.on('SIGHUP', shutdown);
process.on('SIGQUIT', shutdown);
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

app.get('/', (req, res) => {
  const msg = `<h1>Hello from the API!</h1><h2>This instance's unique emoji is: ${emojid}</h2>`
  return res.set('Content-Type','text/html').send(msg);
});

app.get('/healthcheck', (req, res) => {
  console.log(`[Healthcheck] ✔️ (${emojid})`);
  res.sendStatus(200)
});

app.get('/socket.io', (req, res) => {
  res.status(502).json({
    error: 502,
    'why?': "coz we shoudln't be able to get to this route"
  })
})

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}! (${emojid})`);
});
