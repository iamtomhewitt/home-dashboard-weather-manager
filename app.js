const express = require('express');
const bodyParser = require('body-parser');
const listEndpoints = require('express-list-endpoints');
const request = require('request');
const { version } = require('./package.json');

const app = express();

const success = 200;
const badRequest = 400;
const unauthorised = 401;
const serverError = 500;

function response(status, message) {
    return {
        status,
        message,
    };
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(success).send({ status: '🌞 SERVER OK', version, endpoints: listEndpoints(app) });
});

app.get('/weather', (req, res) => {
    const { latitude } = req.query;
    const { longitude } = req.query;
    const { apiKey } = req.query;

    if (!latitude || !longitude || !apiKey) {
        res.status(badRequest).send(response(badRequest, 'There are missing query parameters'));
    }
});

const port = 3001;
app.listen(process.env.PORT || port, () => { });

module.exports = app;
