require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { alexa } = require('alexa-sdk');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/alexa', async (req, res) => {
    const alexaHandler = {
        'LaunchRequest': function () {
            this.response.speak('Bună! Sunt Curiosul. Poți să mă întrebi orice.');
            this.response.shouldEndSession(false);
            this.emit(':responseReady');
        },
        'AskCuriosulIntent': async function () {
            const question = this.event.request.intent.slots.Question.value;

            try {
                const response = await axios.post(
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
                            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                        }
                    }
                );

                const answer = response.data.choices[0].message.content.trim();
                this.response.speak(answer);
                this.response.shouldEndSession(true);

            } catch (error) {
                console.error('OpenAI Error:', error.message);
                this.response.speak('Am întâmpinat o problemă. Încercă mai târziu.');
            }

            this.emit(':responseReady');
        },
        'AMAZON.HelpIntent': function () {
            this.response.speak('Poți să mă întrebi orice!');
            this.emit(':responseReady');
        },
        'AMAZON.StopIntent': function () {
            this.response.speak('La revedere!');
            this.emit(':responseReady');
        },
        'AMAZON.CancelIntent': function () {
            this.response.speak('Oprește.');
            this.emit(':responseReady');
        }
    };

    const handler = alexa(req, res);
    handler.execute(alexaHandler);
});

app.listen(PORT, () => {
    console.log(`Serverul rulează pe portul ${PORT}`);
});