const app = require('../app')
const request = require('supertest')
const mongoose = require('mongoose')
const Order = require('../models/Order')
const Record = require('../models/Record')
const User = require('../models/User')
const faker = require('faker')

let server;

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
        const res = await request(app).get('/orders')
        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBeTruthy()
        expect(res.body.length).toBeGreaterThan(0)
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.not.objectContaining({ 
                    price: expect.anything(),
                    year: expect.anything()
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
        const res = await request(app).get(`/orders/${fakeOrder.id}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(
            expect.not.objectContaining({ 
                price: expect.anything(),
                year: expect.anything()
            })
        )

        done()
    })

    test('/users should not show password', async done => {
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
            password: faker.internet.password()
        })
        await fakeUser.save()
        const compUser = fakeUser.toObject()
        compUser._id = compUser._id.toString()
        const res = await request(app).get(`/users/${fakeUser.id}`)
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
                password: faker.internet.password()
            });

            return user.save();
            })
        await Promise.all(userPromises)
        const res = await request(app).get('/users')
        expect(res.statusCode).toBe(200)
        expect(res.body).toBeInstanceOf(Array)
        expect(res.body.length).toBeLessThanOrEqual(5)

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