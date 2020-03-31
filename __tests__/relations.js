const app = require('../app')
const request = require('supertest')
const mongoose = require('mongoose')
const Order = require('../models/Order')
const Record = require('../models/Record')
const {exec} = require('child_process')
const faker = require('faker')

let server;

describe('DB Relations', () => {
    test('order list should have record info', async done => {
        // create record
        const fakeRecord = {
            title: 'Greatest Hits special edition',
            artist: 'George Michael',
            year: 2002,
            img: 'img/folder',
            price: 10
          }
        const resRecord = await Record.create(fakeRecord)
        // create order
        const fakeOrder = {
            quantity: 1,
            record: resRecord._id
          }
        const resOrder = await request(app)
            .post(`/orders`)
            .send(fakeOrder)
        const res = await request(app).get(`/orders`)
        expect(Array.isArray(res.body)).toBeTruthy()
        expect(res.body[0]).toHaveProperty('record')
        expect(res.body[0].record).toHaveProperty('title')
        expect(res.body[0].record).toHaveProperty('artist')
        done()
    })

    test('specific order should have record info', async done => {
        // create record
        const fakeRecord = {
            title: 'Greatest Hits special edition',
            artist: 'George Michael',
            year: 2002,
            img: 'img/folder',
            price: 10
          }
        const resRecord = await Record.create(fakeRecord)
        // create order
        const fakeOrder = {
            quantity: 1,
            record: resRecord._id
          }
        const resOrder = await request(app)
            .post(`/orders`)
            .send(fakeOrder)
        const res = await request(app).get(`/orders/${resOrder.body._id}`)
        expect(res.body).toHaveProperty('record')
        expect(res.body.record).toHaveProperty('title')
        expect(res.body.record).toHaveProperty('artist')
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