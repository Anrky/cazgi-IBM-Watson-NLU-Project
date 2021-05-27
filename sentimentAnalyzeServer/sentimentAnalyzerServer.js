const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });

    return naturalLanguageUnderstanding;
}


const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/", (req, res) => {
    res.render('index.html');
});

app.get("/url/emotion", (req, res) => {

    const analyzeParams = {
        url: req.query.url,
        features: {
            emotion: {}
        }
    };
    let response = getNLUInstance().analyze(analyzeParams)
        .then(analysisResults => {
            let resultAnalysis = JSON.stringify(
                analysisResults.result.emotion.document.emotion
                , null, 2);
            return res.send(resultAnalysis);
        })
        .catch(err => {
            console.log('error:', err);
            return res.send(err);
        });

});

app.get("/url/sentiment", (req, res) => {
    const analyzeParams = {
        url: req.query.url,
        features: {
            sentiment: {}
        }
    };
    let response = getNLUInstance().analyze(analyzeParams)
        .then(analysisResults => {
            return res.send(analysisResults.result.sentiment.document.label);
        })
        .catch(err => {
            console.log('error:', err);
            return res.send(err);
        });
});

app.get("/text/emotion", (req, res) => {

    const analyzeParams = {
        text: req.query.text,
        features: {
            emotion: {}
        }
    };
    let response = getNLUInstance().analyze(analyzeParams)
        .then(analysisResults => {
            let resultAnalysis = JSON.stringify(
                analysisResults.result.emotion.document.emotion
                , null, 2);
            return res.send(resultAnalysis);
        })
        .catch(err => {
            console.log('error:', err);
            return res.send(err);
        });

});

app.get("/text/sentiment", (req, res) => {

    const analyzeParams = {
        text: req.query.text,
        features: {
            sentiment: {}
        }
    };
    let response = getNLUInstance().analyze(analyzeParams)
        .then(analysisResults => {
            return res.send(analysisResults.result.sentiment.document.label);
        })
        .catch(err => {
            console.log('error:', err);
            return res.send(err);
        });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
});