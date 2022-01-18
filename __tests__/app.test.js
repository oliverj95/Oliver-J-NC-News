const request = require("supertest");

const db = require("../db/connection.js");

const testData = require("../db/data/test-data/index.js");

const seed = require("../db/seeds/seed.js");

const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/topics", () => {
  test("status: 200 & responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.body.topics).toBeInstanceOf(Array);
        res.body.topics.forEach((topic) =>
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          })
        );
      });
  });
});
describe("/api/invalid_endpoint", () => {
  test("error message 404: responds with an error message", () => {
    return request(app)
      .get("/api/invalid_endpoint")
      .expect(404)
      .then((res) => {
        expect(res.body.message).toBe("Status code 404: not found");
      });
  });
});
describe.only("api/articles/:article_id", () => {
  test("status 200: responds with an object when specified ", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        expect(res.body.article).toEqual({
            author: 'butter_bridge',
            title: 'Living in the shadow of a great man',
            article_id: 1,
            body: 'I find this existence challenging',
            topic: 'mitch',
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            comment_count: 11
          })
      });
  });
});
// describe("", () => {
//     test("", () => {

//     })
// })
