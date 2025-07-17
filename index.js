const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());

// Ruta de test
app.get('/', (req, res) => {
    res.send('Curiosul e online!');
});

// Endpoint Alexa
app.post('/alexa', async (req, res) => {
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
        const question = body.request.intent.slots.Question.value;

        try {
            const chatGptResponse = await axios.post(
                'https://api.openai.com/v1/chat/completions ',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: question }
                    ],
                    max_tokens: 150,
                    temperature: 0.7
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const answer = chatGptResponse.data.choices[0].message.content.trim();

            return res.json({
                version: '1.0',
                response: {
                    outputSpeech: {
                        type: 'PlainText',
                        text: answer
                    },
                    shouldEndSession: true
                }
            });

        } catch (error) {
            console.error('OpenAI Error:', error.message);
            return res.json({
                version: '1.0',
                response: {
                    outputSpeech: {
                        type: 'PlainText',
                        text: 'Am întâmpinat o problemă. Încercă mai târziu.'
                    }
                }
            });
        }
    }

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

// Ascultă pe portul oferit de Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Serverul rulează pe portul ${PORT}`));