const app = require('../app')
const request = require('supertest')
const mongoose = require('mongoose')
const Order = require('../models/Order')
const Record = require('../models/Record')
const {exec} = require('child_process')
const faker = require('faker')
const User = require('../models/User')

let server;
let token;

describe('Orders Endpoints', () => {
    test('should get list of all orders', async done =>{
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
        done()
    })

    test('should get specific order', async done =>{
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
        expect(res.body._id).toBe(fakeOrder.id)
        done()
    })

    test('should delete Order', async done =>{
        const testRecord = await Record.create({
            title: 'best of',
            artist: 'George Michael',
            year: 2001,
            img: 'img/folder',
            price: 6
          })
        const fakeOrder = new Order({
            quantity: 1,
            record: testRecord.id
          })
        await fakeOrder.save()
        let checkOrder = await Order.findById(fakeOrder.id)
        expect(checkOrder.toObject()).toEqual(fakeOrder.toObject())
        const res = await request(app).delete(`/orders/${fakeOrder.id}`).set('x-auth', `${token}`)
        expect(res.statusCode).toBe(200)
        checkOrder = Order.findOne(fakeOrder.id)
        expect(checkOrder.length).toBeFalsy()
        done()
    })

    test('should update Order', async done => {
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
        const fakeQuantity = 3
        const res = await request(app)
            .put(`/orders/${fakeOrder.id}`)
            .set('x-auth', `${token}`)
            .send({quantity: fakeQuantity})
        expect(res.body.quantity).toBe(fakeQuantity)
        done()
    })

    test('should create new order', async done => {
        const testRecord = await Record.create({
            title: 'best of',
            artist: 'George Michael',
            year: 2001,
            img: 'img/folder',
            price: 6
          })
        const fakeOrder = {
            quantity: 1,
            record: testRecord.id
          }
        const res = await request(app)
            .post(`/orders`)
            .set('x-auth', `${token}`)
            .send(fakeOrder)
        const checkOrder = await Order.findOne({'record': fakeOrder.record})
        expect(checkOrder).toHaveProperty(['record'])
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