const request = require("supertest")

const db = require('../db/connection.js');

const testData = require('../db/data/test-data/index.js');

const seed = require('../db/seeds/seed.js');

const app = require("../app")

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/topics", () => {
    test("status: 200 & responds with an array of topics", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
            expect(res.body.topics.toBeInstanceOf(Array));
            res.body.topics.forEach((topic).toMatchObject(
                {slug: expect.any(String),
                    description: expect.any(string)
                }))
        })
    })
})
// describe("this is a test", () => {
//     test("this is the test", () => {

//     })
// })