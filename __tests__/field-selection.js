const app = require('../app')
const request = require('supertest')
const mongoose = require('mongoose')
const Order = require('../models/Order')
const Record = require('../models/Record')
const User = require('../models/User')
const faker = require('faker')

let server;
let token;

describe('Select Data Fields', () => {
    test('/orders Record should not have price and year', async done => {
        const testRecord = await Record.create({
            title: 'best of',
            artist: 'George Michael',
            year: 2001,
            img: 'img/folder',
            price: 6
          })
        await Order.create({
            quantity: 1,
            record: testRecord.id
          })
        const res = await request(app).get('/orders').set('x-auth', `${token}`)
        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBeTruthy()
        expect(res.body.length).toBeGreaterThan(0)
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    record: expect.not.objectContaining({ 
                        price: expect.anything(),
                        year: expect.anything()
                    })
                })
            ])
        )

        done()
    })

    test('/orders/:id Record should not have price and year', async done => {
        const testRecord = await Record.create({
            title: 'best of',
            artist: 'George Michael',
            year: 2001,
            img: 'img/folder',
            price: 6
          })
        const fakeOrder = new Order({
            quantity: 2,
            record: testRecord.id
          })
        await fakeOrder.save()
        const compOrder = fakeOrder.toObject()
        compOrder._id = compOrder._id.toString()
        const res = await request(app).get(`/orders/${fakeOrder.id}`).set('x-auth', `${token}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('record', expect.any(Object))
        expect(res.body).toEqual(
            expect.objectContaining({
                record: expect.not.objectContaining({ 
                    price: expect.anything(),
                    year: expect.anything()
                })
            })
        )

        done()
    })

    test('/users should not show password', async done => {
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
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.not.objectContaining({ 
                    password: expect.anything()
                })
            ])
        )

        done()
    })

    test('/users/:id should not show password', async done => {
        const fakeUser = new User({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: 'User'
        })
        await fakeUser.save()
        const compUser = fakeUser.toObject()
        compUser._id = compUser._id.toString()
        const res = await request(app).get(`/users/${fakeUser.id}`).set('x-auth', `${token}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(
            expect.not.objectContaining({ 
                password: expect.anything()
            })
        )

        done()
    })

    test('/users should return max 5 users', async done => {
        const userPromises = Array(6)
            .fill(null)
            .map(() => {
            const user = new User({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                role: 'User'
            });

            return user.save();
            })
        await Promise.all(userPromises)
        const res = await request(app).get('/users').set('x-auth', `${token}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toBeInstanceOf(Array)
        expect(res.body.length).toBeLessThanOrEqual(5)

        done()
    })

    test('Users should be sorted by last name', async done => {
        function compare(a, b) {
            const nameA = a.lastName.toUpperCase();
            const nameB = b.lastName.toUpperCase();
          
            let comparison = 0;
            if (nameA > nameB) {
              comparison = 1;
            } else if (nameA < nameB) {
              comparison = -1;
            }
            return comparison;
        }

        const res = await request(app).get('/users').set('x-auth', `${token}`)
        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBeTruthy()
        expect(res.body.length).toBeGreaterThan(0)
        const sortedList = [...res.body]
        sortedList.sort(compare)
        expect(res.body).toEqual(sortedList)

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