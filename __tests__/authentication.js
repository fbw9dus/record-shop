const app = require('../app')
const request = require('supertest')
const mongoose = require('mongoose')
const User = require('../models/User')
const faker = require('faker')

let server;

describe('User Rights', () => {
    test('User without token should not be able to access user data', async done => {
        const fakeUser = new User({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: "User"
        })
        await fakeUser.save()
        const compUser = fakeUser.toObject()
        delete compUser.password
        const res = await request(app).get(`/users/${fakeUser.id}`)

        expect(res.statusCode).not.toBe(200)
        expect(res.body).toEqual(expect.not.objectContaining(fakeUser))
        done()
    })

    test('User with token should be able to access user data', async done => {
        const fakeUser = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: "User"
        }
        let checkUser = await User.create(fakeUser)
        //log in user
        const login = await request(app)
            .post(`/users/login`)
            .send({
                email: fakeUser.email,
                password: fakeUser.password
            })
        const token = login.header["x-auth"]
        delete fakeUser.password
        const res = await request(app).get(`/users/${checkUser.id}`).set('x-auth', `${token}`)

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(expect.objectContaining(fakeUser))
        done()
    })

    test('User with User token should not be able to access users list', async done => {
        const fakeUser = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: "User"
        }
        let checkUser = await User.create(fakeUser)
        //log in user
        const login = await request(app)
            .post(`/users/login`)
            .send({
                email: fakeUser.email,
                password: fakeUser.password
            })
        const token = login.header["x-auth"]
        delete fakeUser.password
        const res = await request(app).get(`/users`).set('x-auth', `${token}`)
        delete fakeUser.password
        expect(res.statusCode).not.toBe(200)
        expect(res.body).toEqual(
            expect.not.arrayContaining([
                expect.objectContaining(fakeUser)
            ])
        )
        done()
    })

    test('User with Admin token should be able to access users list', async done => {
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
        const token = login.header["x-auth"]
        const res = await request(app).get(`/users`).set('x-auth', `${token}`)
        delete fakeUser.password
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    email: expect.anything()
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