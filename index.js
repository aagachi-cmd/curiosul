const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Acceptă JSON în POST requests
app.use(bodyParser.json());

// Ruta principală – doar pt testare
app.get('/', (req, res) => {
    res.send('Curiosul e online!');
});

// Endpoint-ul Alexa
app.post('/alexa', (req, res) => {
    const body = req.body;

    // Verificăm dacă e LaunchRequest
    if (body.version && !body.session) {
        return res.json({
            version: '1.0',
            response: {
                outputSpeech: {
                    type: 'PlainText',
                    text: 'Bună! Sunt Curiosul. Poți să mă întrebi orice.'
                },
                shouldEndSession: false
            }
        });
    }

    // Verificăm dacă e IntentRequest
    if (body.session?.new === true && body.request?.type === 'IntentRequest') {
        const question = body.request.intent.slots.Question.value || 'nimic';

        return res.json({
            version: '1.0',
            response: {
                outputSpeech: {
                    type: 'PlainText',
                    text: `Ai întrebat: ${question}`
                },
                shouldEndSession: true
            }
        });
    }

    // Dacă nu e niciuna dintre cele de mai sus → eroare
    return res.status(400).json({
        version: '1.0',
        response: {
            outputSpeech: {
                type: 'PlainText',
                text: 'Nu am primit o cerere validă.'
            }
        }
    });
});

// Ascultă pe portul oferit de Render (implicit 10000)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Serverul rulează pe portul ${PORT}`));