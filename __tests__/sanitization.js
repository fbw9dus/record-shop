const app = require('../app')
const request = require('supertest')
const mongoose = require('mongoose')
const User = require('../models/User')
const faker = require('faker')
const validator = require('validator')

let server;
let token;

describe('Sanitization', () => {
    test('email in db should be sanitized', async done => {
        ////// EMAIL
        
        const unsanitizedData = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email().toUpperCase(),
            password: faker.internet.password(),
            role: 'User'
        }
        const sanitizedEmail = validator.normalizeEmail(unsanitizedData.email)
        
        const res = await request(app)
            .post(`/users`)
            .set('x-auth', `${token}`)
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
            password: faker.internet.password(),
            role: 'User'
        }
        const res = await request(app)
            .post(`/users`)
            .set('x-auth', `${token}`)
            .send(unsanitizedData)
        const checkUser = await User.findById(res.body._id)
        expect(checkUser.firstName).toBe(sanitizedFirstName)
        done()
    })
})

beforeAll(async (done) => {
    server = app.listen(3000, async () => {
        global.agent = request.agent(server);

        //login
        const fakeUser = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: "Admin"
        }
        let checkUser = await User.create(fakeUser)
        //log in user
        const login = await request(app)
            .post(`/users/login`)
            .send({
                email: fakeUser.email,
                password: fakeUser.password
            })
        token = login.header["x-auth"]
        done();
    });
});
  
afterAll(async () => {
    await server.close();
    await mongoose.disconnect();
});