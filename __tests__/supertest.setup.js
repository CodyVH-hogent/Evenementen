const supertest = require('supertest');
const createServer = require('../src/createServer');
const {getPrisma} = require('../prisma/index');

const loginAdmin = async (supertest) => {
    const response = await supertest.post('/api/persons/login').send({
        email: 'admin@example.com', password: 'pass1',
    });

    if (response.statusCode !== 200) {
        console.error('Admin login failed. Response:', response.body);
        throw new Error(`Admin login failed with status code ${response.statusCode}`);
    }

    return `Bearer ${response.body.token}`;
};

const login = async (supertest) => {
    const response = await supertest.post('/api/persons/login').send({
        email: 'user@example.com', password: 'pass1',
    });

    if (response.statusCode !== 200) {
        console.error('Login failed. Response:', response.body);
        throw new Error(`Login failed with status code ${response.statusCode}`);
    }

    return `Bearer ${response.body.token}`;
};

const withServer = (setter) => {
    let server;

    beforeAll(async () => {
        server = await createServer();

        setter({
            prisma: getPrisma(), supertest: supertest(server.getApp().callback()),
        });
    });

    afterAll(async () => {
        await server.stop();
    });
};

module.exports = {
    login, loginAdmin, withServer,
};