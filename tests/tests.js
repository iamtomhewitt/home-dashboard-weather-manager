const request = require('supertest');
const assert = require('assert');

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
