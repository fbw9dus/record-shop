const app = require('../app')
const request = require('supertest')
const mongoose = require('mongoose')
const User = require('../models/User')
const {exec} = require('child_process')
const faker = require('faker')

let server;
let token;

describe('Sub Documents', () => {
    test('user should have address sub document', async done => {
        const fakeUser = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            address: {
                street: faker.address.streetAddress(),
                city: faker.address.city()
            },
            role: 'User'
        }
        const res = await request(app)
            .post(`/users`)
            .set('x-auth', `${token}`)
            .send(fakeUser)
        const checkUser = await User.findById(res.body._id)
        expect(checkUser).toHaveProperty(['address'])
        expect(checkUser.address.street).toBe(fakeUser.address.street)
        expect(checkUser.address.city).toBe(fakeUser.address.city)
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