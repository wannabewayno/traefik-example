const express = require('express');
const app = express();
const emojis = require('./src/emojis.json')
const emojid = emojis[Math.floor(emojis.length*Math.random())]

const PORT = process.env.PORT || 80;

function shutdown(signal) {
  console.info(`Recieved ${signal}; Shutting down...`)
  return process.exit(0);
}

let healthy = true;
let seconds = 0;

process.on('SIGHUP', shutdown);
process.on('SIGQUIT', shutdown);
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

if (process.env.SIMULATE_UNHEALTHY_SERVERS === 'true') {
  healthy = (Math.random() >= 0.5)
  const healthyInterval = (Math.floor(Math.random() * 60)) + 15;
  if (healthy) seconds = healthyInterval

  setInterval(() => {
    if (seconds <= 0) {
      healthy = !healthy;
      seconds = healthyInterval;
    } else seconds--
  }, 1000);
}

app.get('/socket.io', (req, res) => {
  let msg = `<h1>Hello from Sockets!</h1><h2>This instance's unique emoji is: ${emojid}</h2>`
  if (process.env.SIMULATE_UNHEALTHY_SERVERS === 'true') {
    if (healthy) msg += `<p>This server is not feeling well and be unavailable in ${seconds} seconds</p>`
    else msg = `<h1>This server is down (${emojid})</h1>`
  }

  return res.set('Content-Type','text/html').send(msg);
});

app.get('/healthcheck', (req, res) => {
  console.log(`[Healthcheck] ${healthy ? '✔️' : '🤕'} (${emojid})`);
  if (healthy) return res.sendStatus(200);
  return res.sendStatus(504);
});

app.listen(PORT, () => {
  console.log(`Sockets listening on port ${PORT}!`);
});
