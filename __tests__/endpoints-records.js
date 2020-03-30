const app = require('../app')
const request = require('supertest')
const mongoose = require('mongoose')
const Record = require('../models/Record')
const {exec} = require('child_process')
const faker = require('faker')

let server;

describe('Records Endpoints', () => {
    test('should get list of all records', async done =>{
        await Record.create({
            title: 'Last Christmas',
            artist: 'George Michael',
            year: 1992,
            img: 'img/folder',
            price: 5
          })
        const res = await request(app).get('/records')
        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBeTruthy()
        expect(res.body.length).toBeGreaterThan(0)
        done()
    })

    test('should get specific record', async done =>{
        const fakeRecord = new Record({
            title: 'Lets go outside',
            artist: 'George Michael',
            year: 1992,
            img: 'img/folder',
            price: 3
          })
        await fakeRecord.save()
        const compRecord = fakeRecord.toObject()
        compRecord._id = compRecord._id.toString()
        const res = await request(app).get(`/records/${fakeRecord.id}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(compRecord)
        done()
    })

    test('should delete record', async done =>{
        const fakeRecord = new Record({
            title: 'Dont know',
            artist: 'George Michael',
            year: 1998,
            img: 'img/folder',
            price: 3
          })
        await fakeRecord.save()
        let checkRecord = await Record.findById(fakeRecord.id)
        expect(checkRecord.toObject()).toEqual(fakeRecord.toObject())
        const res = await request(app).delete(`/records/${fakeRecord.id}`)
        expect(res.statusCode).toBe(200)
        checkRecord = Record.findOne(fakeRecord.id)
        expect(checkRecord.length).toBeFalsy()
        done()
    })

    test('should update record', async done => {
        const fakeRecord = new Record({
            title: 'best of',
            artist: 'George Michael',
            year: 2001,
            img: 'img/folder',
            price: 6
          })
        await fakeRecord.save()
        const fakePrice = 3
        const res = await request(app)
            .put(`/records/${fakeRecord.id}`)
            .send({price: fakePrice})
        expect(res.body.price).toBe(fakePrice)
        done()
    })

    test('should create new record', async done => {
        const fakeRecord = {
            title: 'Greatest Hits special edition',
            artist: 'George Michael',
            year: 2002,
            img: 'img/folder',
            price: 10
          }
        const res = await request(app)
            .post(`/records`)
            .send(fakeRecord)
        const checkRecord = await Record.findOne({'title': fakeRecord.title})
        expect(checkRecord).toHaveProperty(['title'])
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