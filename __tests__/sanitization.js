const app = require('../app')
const request = require('supertest')
const mongoose = require('mongoose')
const User = require('../models/User')
const faker = require('faker')
const validator = require('validator')

let server;

describe('Sanitization', () => {
    test('email in db should be sanitized', async done => {
        ////// EMAIL
        const unsanitizedEmail = 'CamelCase@googlemail.com'
        const sanitizedEmail = validator.normalizeEmail(unsanitizedEmail)
        console.log(sanitizedEmail)
        const unsanitizedData = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: unsanitizedEmail,
            password: faker.internet.password()
        }
        
        const res = await request(app)
            .post(`/users`)
            .send(unsanitizedData)
        const checkUser = await User.findById(res.body._id)
        expect(checkUser.email).toBe(sanitizedEmail)
        done()
    })
    test('firstname in db should be sanitized', async done => {
        ///// FIRSTNAME
        const unsanitizedFirstName = '  Maxim   '
        const sanitizedFirstName = validator.trim(unsanitizedFirstName)
        const unsanitizedData = {
            firstName: unsanitizedFirstName,
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        }
        const res = await request(app)
            .post(`/users`)
            .send(unsanitizedData)
        const checkUser = await User.findById(res.body._id)
        expect(checkUser.firstName).toBe(sanitizedFirstName)
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