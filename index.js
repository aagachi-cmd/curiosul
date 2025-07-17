if (requestType === 'LaunchRequest') {
  res.json({
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: 'Salut! Poți să-mi pui o întrebare.'
      },
      shouldEndSession: false
    }
  });
} else if (requestType === 'IntentRequest') {
  const intent = request.request.intent;
  const userQuestion = intent.slots?.question?.value || "nu am înțeles întrebarea";

  // Poți înlocui cu logica ta de căutare în JSON
  const answer = `Ai întrebat: ${userQuestion}. Momentan răspunsul este generat fix.`; // TODO: conectează cu baza ta de date

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
