const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());

app.post('/alexa', async (req, res) => {
    const request = req.body;

    if (request.request.type === 'LaunchRequest') {
        return res.json({
            version: '1.0',
            response: {
                outputSpeech: {
                    type: 'PlainText',
                    text: 'Bună! Sunt Curiosul. Poți să mă întrebi orice.'
                }
            }
        });
    }

    if (request.request.type === 'IntentRequest' && request.request.intent.name === 'AskCuriosulIntent') {
        const question = request.request.intent.slots.Question.value;

        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions ', {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: question }]
            }, {
                headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
            });

            const answer = response.data.choices[0].message.content.trim();

            return res.json({
                version: '1.0',
                response: {
                    outputSpeech: {
                        type: 'PlainText',
                        text: answer
                    }
                }
            });

        } catch (err) {
            console.error(err);
            return res.json({
                version: '1.0',
                response: {
                    outputSpeech: {
                        type: 'PlainText',
                        text: 'Îmi pare rău, momentan nu pot răspunde.'
                    }
                }
            });
        }
    }

    res.status(400).send('Unknown intent');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Serverul rulează pe portul ${PORT}`));
