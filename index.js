const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Răspuns test pe GET /
app.get('/', (req, res) => {
    res.send('Curiosul e online!');
});

// Endpoint pentru Alexa
app.post('/alexa', (req, res) => {
    const body = req.body;

    // Răspunde la LaunchRequest
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

    // Răspunde la întrebări
    if (body.session?.new === true && body.request?.type === 'IntentRequest') {
        const question = body.request.intent.slots.Question.value;

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

    // Răspuns generic pentru erori
    return res.status(400).json({
        version: '1.0',
        response: {
            outputSpeech: {
                type: 'PlainText',
                text: 'Nu am primit o întrebare validă.'
            }
        }
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serverul rulează pe portul ${PORT}`);
});
