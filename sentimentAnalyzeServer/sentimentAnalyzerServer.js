const express = require('express');
const dotenv = require('dotenv');
const app = new express();

// loads the content of .env file into process.env
dotenv.config();

/*This tells the server to allow cross origin references*/
const cors_app = require('cors');
app.use(cors_app());

/*This tells the server to use the client 
folder for all static resources*/
app.use(express.static('client'));

/*Uncomment the following lines to loan the environment 
variables that you set up in the .env file*/

// const dotenv = require('dotenv');
// dotenv.config();

const api_key = process.env.API_KEY;
const api_url = process.env.API_URL;

function getNLUInstance() {
    /*Type the code to create the NLU instance and return it.
    You can refer to the image in the instructions document
    to do the same.*/
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-08-01', 
        authenticator: new IamAuthenticator({
            apikey: api_key
        }), 
        serviceUrl: api_url
    });
    
    return naturalLanguageUnderstanding;
}


//The default endpoint for the webserver
app.get('/', (req,res)=>{
    res.render('index.html');
  });

//The endpoint for the webserver ending with /url/emotion
app.get('/url/emotion', async (req,res) => {
    // //Extract the url passed from the client through the request object
    let urlToAnalyze = req.query.url;
    const analyzeParams = {
        url: urlToAnalyze,
        features: {
            keywords: {
                emotion: true,
                limit: 1
            }
        }
    }

    try {
        const naturalLanguageUnderstanding = getNLUInstance();
        const analysisResults = await naturalLanguageUnderstanding.analyze(analyzeParams)
        //Retrieve the emotion and return it as a formatted string
        res.status(200);
        return res.send(analysisResults.result.keywords[0].emotion,null,2);
    } catch (err) {
        res.status(500);
        return res.send('Could not do desired operation: ' + err);
    };
});

//The endpoint for the webserver ending with /url/sentiment
app.get('/url/sentiment', async (req,res) => {
    const urlToAnalyze = req.query.url;
    const analyzeParams = {
        url: urlToAnalyze, 
        features: {
            keywords: {
                sentiment: true, 
                limit: 1
            }
        }
    };
    try {
        const naturalLanguageUnderstanding = getNLUInstance();
        const analysisResults = await naturalLanguageUnderstanding.analyze(analyzeParams);
        res.status(200);
        res.send(analysisResults.result.keywords[0].sentiment);
    } catch (err) {
        res.status(500);
        res.send('Could not do desired operation: ' + err);
    }
});

//The endpoint for the webserver ending with /text/emotion
app.get('/text/emotion', async (req,res) => {
    const textToAnalyze = req.query.text;
    const analyzeParams = {
        text: textToAnalyze, 
        features: {
            keywords: {
                emotion: true, 
                limit: 1
            }
        }
    };
    try {
        const naturalLanguageUnderstanding = getNLUInstance();
        const analysisResults = await naturalLanguageUnderstanding.analyze(analyzeParams);
        res.status(200);
        res.send(analysisResults.result.keywords[0].emotion);
    } catch (err) {
        res.status(500);
        res.send('Could not do desired operation: ' + err);
    }
});

app.get('/text/sentiment', async (req,res) => {
    const textToAnalyze = req.query.text;
    const analyzeParams = {
        text: textToAnalyze, 
        features: {
            keywords: {
                sentiment: true, 
                limit: 1
            }
        }
    };
    try {
        const naturalLanguageUnderstanding = getNLUInstance();
        const analysisResults = await naturalLanguageUnderstanding.analyze(analyzeParams);
        res.status(200);
        res.send(analysisResults.result.keywords[0].sentiment);
    } catch (err) {
        res.status(500);
        res.send('Could not do desired operation: ' + err);
    }
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

