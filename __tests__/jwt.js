const app = require('../app')
const request = require('supertest')
const mongoose = require('mongoose')
const User = require('../models/User')
const faker = require('faker')

let server;

describe('Create Access Token', () => {
    test('New User should have token', async done => {
        const fakeUser = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: "User"
        }
        const res = await request(app)
            .post(`/users`)
            .send(fakeUser)
        const checkUser = await User.findById(res.body._id)
        expect(res.header).toEqual(
            expect.objectContaining({ 
                'x-auth': expect.anything()
            })
        )
        expect(checkUser.tokens).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ 
                    token: res.header['x-auth']
                })
            ])
        )
        done()
    })

    test('Login should have token', async done => {
        const fakeUser = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: "User"
        }
        let checkUser = await User.create(fakeUser)
        // Do login for user
        const res = await request(app)
            .post(`/users/login`)
            .send({
                email: fakeUser.email,
                password: fakeUser.password
            })
        // get copy with recent data
        checkUser = await User.findById(checkUser.id)
        // Check token
        expect(res.header).toEqual(
            expect.objectContaining({ 
                'x-auth': expect.anything()
            })
        )
        expect(checkUser.tokens).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ 
                    token: res.header['x-auth']
                })
            ])
        )
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