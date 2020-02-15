const request = require('supertest');
const assert = require('assert');
require('dotenv').config();

describe('/ tests', () => {
    let server;

    before(() => {
        server = require('../app').listen(3002);
    });

    after(() => {
        server.close();
    });

    it('/ gives 200', (done) => {
        request(server)
            .get('/')
            .expect(200)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }
                const { version } = require('../package.json');
                const status = '🌞 SERVER OK';

                assert.equal(response.body.version, version);
                assert.equal(response.body.status, status);

                return done();
            });
    });
});

describe('/weather tests', () => {
    let server;

    before(() => {
        server = require('../app').listen(3002);
    });

    after(() => {
        server.close();
    });

    it('/weather gives 200', (done) => {
        request(server)
            .get(`/weather?latitude=&longitude=&apiKey=${process.env.API_KEY}`)
            .expect(200)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.notEqual(response.body.current, null);
                assert.notEqual(response.body.current.summary, null);
                assert.notEqual(response.body.current.icon, null);
                assert.notEqual(response.body.current.temperature, null);

                assert.notEqual(response.body.week, null);
                assert.notEqual(response.body.week[0].day, null);
                assert.notEqual(response.body.week[0].icon, null);
                assert.notEqual(response.body.week[0].temperatureLow, null);
                assert.notEqual(response.body.week[0].temperatureHigh, null);

                return done();
            });
    });

    it('/weather gives 400 if query parameters are missing', (done) => {
        request(server)
            .get('/weather')
            .expect(400)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.status, 400);
                assert.equal(response.body.message, 'There are missing query parameters');

                return done();
            });
    });

    it('/weather gives 401 if API key is incorrect', (done) => {
        request(server)
            .get('/weather?latitude=10&longitude=5&apiKey=incorrect')
            .expect(401)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                assert.equal(response.body.status, 401);
                assert.equal(response.body.message, 'API key is incorrect');

                return done();
            });
    });
});
