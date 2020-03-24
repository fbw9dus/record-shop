const app = require('../app')
const request = require('supertest')
const mongoose = require('mongoose')
const User = require('../models/User')
const {exec} = require('child_process')
const faker = require('faker')

let server;

describe('Validation', () => {
    test('should return error on incorrect input and not save in db', async done => {
        const wrongMail = 'wrong.mail.com'
        const wrongData = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: wrongMail,
            password: faker.internet.password()
        }
        const res = await request(app)
            .post(`/users`)
            .send(wrongData)
        expect(res.body).toHaveProperty(['errors'])
        const checkUser = await User.findOne({'email': wrongMail})
        expect(checkUser).toBeFalsy()
        done()
    })
    test('should save in db when data correct', async done => {
        const fakeUser = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        }
        await request(app)
            .post(`/users`)
            .send(fakeUser)
        const checkUser = await User.findOne({'email': fakeUser.email})
        expect(checkUser).toHaveProperty(['email'])
        done()
    })
})

beforeAll(async (done) => {
    server = app.listen(3000, () => {
        global.agent = request.agent(server);
        done();
    });
});
  
afterAll(async () => {
    await server.close();
    await mongoose.disconnect();
});