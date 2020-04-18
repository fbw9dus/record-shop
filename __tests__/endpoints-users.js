const app = require('../app')
const request = require('supertest')
const mongoose = require('mongoose')
const User = require('../models/User')
const {exec} = require('child_process')
const faker = require('faker')

let server;

describe('Users Endpoints', () => {
    test('should get list of all users', async done =>{
        await User.create({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        })
        const res = await request(app).get('/users')
        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBeTruthy()
        expect(res.body.length).toBeGreaterThan(0)
        done()
    })

    test('should get specific user', async done =>{
        const fakeUser = new User({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        })
        await fakeUser.save()
        const compUser = fakeUser.toObject()
        compUser._id = compUser._id.toString()
        const res = await request(app).get(`/users/${fakeUser.id}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(compUser)
        done()
    })

    test('should delete user', async done =>{
        const fakeUser = new User({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        })
        await fakeUser.save()
        let checkUser = await User.findById(fakeUser.id)
        expect(checkUser.toObject()).toEqual(fakeUser.toObject())
        const res = await request(app).delete(`/users/${fakeUser.id}`)
        expect(res.statusCode).toBe(200)
        checkUser = User.findOne(fakeUser.id)
        expect(checkUser.length).toBeFalsy()
        done()
    })

    test('should update user', async done => {
        const fakeUser = new User({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        })
        await fakeUser.save()
        const fakeEmail = 'newfakemail@mail.com'
        const res = await request(app)
            .put(`/users/${fakeUser.id}`)
            .send({email: fakeEmail})
        expect(res.body.email).toBe(fakeEmail)
        done()
    })

    test('should create new user', async done => {
        const fakeUser = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        }
        const res = await request(app)
            .post(`/users`)
            .send(fakeUser)
        const checkUser = await User.findById(res.body._id)
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