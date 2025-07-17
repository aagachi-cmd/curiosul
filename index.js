const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

// Ruta GET simplă
app.get('/', (req, res) => {
  res.send('Curiosul răspunde: serverul funcționează!');
});

// Ruta pentru cereri POST de la Alexa
app.post('/webhook', (req, res) => {
  const request = req.body;

  if (!request || !request.request || !request.request.type) {
    return res.status(400).json({
      error: 'Cerere invalidă - lipsește request.type'
    });
  }

  const requestType = request.request.type;

  if (requestType === 'LaunchRequest') {
    res.json({
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: 'Salut! Curiosul te ascultă.'
        },
        shouldEndSession: false
      }
    });
  } else if (requestType === 'IntentRequest') {
    const intent = request.request.intent;
    const userQuestion = intent.slots?.question?.value || 'nu am înțeles întrebarea';

    const answer = `Întrebarea ta a fost: ${userQuestion}. Curiosul lucrează la răspuns.`;

    res.json({
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: answer
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
          text: 'Tip de cerere necunoscut.'
        },
        shouldEndSession: true
      }
    });
  }
});

// Pornim serverul
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serverul Curiosul rulează pe portul ${PORT}`);
});
