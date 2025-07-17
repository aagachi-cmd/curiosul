app.post('/alexa', (req, res) => {
    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({
            version: '1.0',
            response: {
                outputSpeech: {
                    type: 'PlainText',
                    text: 'Nu am primit nicio întrebare.'
                }
            }
        });
    }

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

    // Răspunde la IntentRequest
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

    // Răspuns generic pentru orice altceva
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
