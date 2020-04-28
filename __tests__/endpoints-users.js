const app = require('../app')
const request = require('supertest')
const mongoose = require('mongoose')
const User = require('../models/User')
const {exec} = require('child_process')
const faker = require('faker')

let server;
let token;

describe('Users Endpoints', () => {
    test('should get list of all users', async done =>{
        await User.create({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: 'User'
        })
        const res = await request(app).get('/users').set('x-auth', `${token}`)
        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBeTruthy()
        expect(res.body.length).toBeGreaterThan(0)
        done()
    })

    test('should get specific user', async done =>{
        const fakeUser = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: 'User'
        }
        const compUser = new User(fakeUser)
        await compUser.save()
        delete fakeUser.password
        const res = await request(app).get(`/users/${compUser.id}`).set('x-auth', `${token}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(expect.objectContaining(fakeUser))
        done()
    })

    test('should delete user', async done =>{
        const fakeUser = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: 'User'
        }
        let checkUser = new User(fakeUser)
        await checkUser.save()
        delete fakeUser.password
        expect(checkUser).toEqual(
            expect.objectContaining(fakeUser)
        )
        const res = await request(app).delete(`/users/${checkUser.id}`).set('x-auth', `${token}`)
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
            password: faker.internet.password(),
            role: 'User'
        })
        await fakeUser.save()
        const fakeEmail = faker.internet.email()
        const res = await request(app)
            .put(`/users/${fakeUser.id}`)
            .set('x-auth', `${token}`)
            .send({email: fakeEmail})
        expect(res.body.email).toBe(fakeEmail)
        done()
    })

    test('should create new user', async done => {
        const fakeUser = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: 'User'
        }
        const res = await request(app)
            .post(`/users`)
            .set('x-auth', `${token}`)
            .send(fakeUser)
        const checkUser = await User.findById(res.body._id)
        expect(checkUser).toHaveProperty(['email'])
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