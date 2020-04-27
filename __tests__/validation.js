const app = require('../app')
const request = require('supertest')
const mongoose = require('mongoose')
const User = require('../models/User')
const faker = require('faker')

let server;
let token;

describe('Validation', () => {
    test('should return error on incorrect email and not save in db', async done => {
        ////// EMAIL
        const wrongMail = 'wrong.mail.com'
        const wrongData1 = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: wrongMail,
            password: faker.internet.password(10),
            role: 'User'
        }
        const res = await request(app)
            .post(`/users`)
            .set('x-auth', `${token}`)
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
            password: faker.internet.password(10),
            role: 'User'
        }
        const res = await request(app)
            .post(`/users`)
            .set('x-auth', `${token}`)
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
            password: wrongPassword,
            role: 'User'
        }
        const res = await request(app)
            .post(`/users`)
            .set('x-auth', `${token}`)
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
            password: faker.internet.password(10),
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
              .set('x-auth', `${token}`)
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