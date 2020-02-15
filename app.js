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
        return;
    }

    const url = `https://api.darksky.net/forecast/${apiKey}/${latitude},${longitude}`;

    request(url, (err, resp) => {
        if (err) {
            res.status(serverError).send(response(serverError, err.message));
            return;
        }

        if (resp.statusCode === 403) {
            res.status(unauthorised).send(response(unauthorised, 'API key is incorrect'));
            return;
        }

        if (resp.statusCode === 200) {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const darkskyResponse = JSON.parse(resp.body);
            const current = {
                summary: darkskyResponse.currently.summary,
                icon: darkskyResponse.currently.icon,
                temperature: darkskyResponse.currently.temperature,
            };
            const week = [];

            for (let i = 1; i < darkskyResponse.daily.data.length; i += 1) {
                const date = new Date(darkskyResponse.daily.data[i].time * 1000);
                const day = days[date.getDay()];
                const icon = darkskyResponse.daily.data[i].icon;
                const temperatureLow = darkskyResponse.daily.data[i].temperatureLow;
                const temperatureHigh = darkskyResponse.daily.data[i].temperatureHigh;

                week.push({
                    day,
                    icon,
                    temperatureLow,
                    temperatureHigh,
                });
            }

            res.status(success).send({ current, week });
        } else {
            res.status(serverError).send(response(serverError, `Could not get weather: ${resp}`));
        }
    });
});

const port = 3001;
app.listen(process.env.PORT || port, () => { });

module.exports = app;
