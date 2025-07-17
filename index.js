// index.js - server Express minimal care rulează pe portul 10000

const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware pentru parsarea JSON
app.use(express.json());

// Exemplu de route
app.get('/', (req, res) => {
  res.send('Serverul rulează corect!');
});

// Exemplu de POST route (dacă ai un API care primește JSON)
app.post('/webhook', (req, res) => {
  const request = req.body;

  // Verificăm dacă request și request.type există
  if (!request || !request.request || !request.request.type) {
    return res.status(400).json({
      error: 'Format cerere invalid - request.type lipsă'
    });
  }

  const requestType = request.request.type;

  if (requestType === 'LaunchRequest') {
    res.json({
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: 'Bună! Skill-ul funcționează corect.'
        },
        shouldEndSession: false
      }
    });
  } else {
    res.json({
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: 'Ai trimis un request de alt tip.'
        },
        shouldEndSession: true
      }
    });
  }
});

// Pornim serverul
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serverul rulează pe portul ${PORT}`);
});
