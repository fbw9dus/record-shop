const app = require('../app')
const request = require('supertest')
const mongoose = require('mongoose')
const Order = require('../models/Order')
const Record = require('../models/Record')
const {exec} = require('child_process')
const faker = require('faker')

let server;

describe('DB Relations', () => {
    test('order should have reference to record', async done => {
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
        const checkOrder = await Order.findById(resOrder.body._id).populate(
                "record",
                "-__v -price -year"
            )
        expect(checkOrder).toHaveProperty('record')
        expect(checkOrder.record).toHaveProperty('title')
        expect(checkOrder.record).toHaveProperty('artist')
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