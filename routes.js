require("dotenv").config();

const express = require("express")
const Dialogflow = require("@google-cloud/dialogflow")
const {v4 : uuid} = require('uuid')
const Path = require("path")
 
const app = express();

app.post("/text-input", async (req, res) => {
  const { message } = req.query;
  console.log(req.query);
  console.log(message);
  // Create a new session
   const sessionClient = new Dialogflow.SessionsClient({
    keyFilename: Path.join(__dirname, "./key.json"),
  });
  console.log('Paso');
  const sessionPath = sessionClient.projectAgentSessionPath(
    'small-talk-ajlu',
    uuid()
  );

  // The dialogflow request object
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: message,
        languageCode: 'en',
      },
    },
  };
  console.log('Paso el envio');
  // Sends data from the agent as a response
  try {
    const responses = await sessionClient.detectIntent(request);
    res.status(200).send({ data: responses });
  } catch (e) {
    console.log(e);
    res.status(422).send({ e });
  }
});

module.exports = app;