const app = require('../app')
const request = require('supertest')
const mongoose = require('mongoose')
const User = require('../models/User')
const faker = require('faker')

let server;

describe('Validation', () => {
    test('should return error on incorrect email and not save in db', async done => {
        ////// EMAIL
        const wrongMail = 'wrong.mail.com'
        const wrongData1 = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: wrongMail,
            password: faker.internet.password(10)
        }
        const res = await request(app)
            .post(`/users`)
            .send(wrongData1)
        expect(res.body).toHaveProperty(['errors'])
        // is saved in DB?
        const checkUser = await User.findById(res.body._id)
        expect(checkUser).toBeFalsy()
        done()
    })
    test('should return error on missing frstname and not save in db', async done => {
        ///// FIRSTNAME
        const wrongData2 = {
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(10)
        }
        const res = await request(app)
            .post(`/users`)
            .send(wrongData2)
        expect(res.body).toHaveProperty(['errors'])
        // is saved in DB?
        const checkUser = await User.findById(res.body._id)
        expect(checkUser).toBeFalsy()
        done()
    })
    test('should return error on incorrect password and not save in db', async done => {
        ///// PASSWORD
        const wrongPassword = '098ab3452'
        const wrongData3 = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: wrongPassword
        }
        const res = await request(app)
            .post(`/users`)
            .send(wrongData3)
        expect(res.body).toHaveProperty(['errors'])
        // is saved in DB?
        const checkUser = await User.findById(res.body._id)
        expect(checkUser).toBeFalsy()
        done()
    })
    test('should save in db when data correct', async done => {
        const fakeUser = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(10)
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