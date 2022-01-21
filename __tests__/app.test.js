const request = require("supertest");

const db = require("../db/connection.js");

const testData = require("../db/data/test-data/index.js");

const seed = require("../db/seeds/seed.js");

const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  //Happy Path
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
//error handling
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
describe("GET api/articles/:article_id", () => {
  test("status 200: responds with an object when specified ", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        expect(res.body.article).toEqual({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          comment_count: 11,
        });
      });
  });
  //error handling
  test("status 400: bad request", () => {
    return request(app)
      .get("/api/articles/not_an_id")
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe("Bad request");
      });
  });
  test("status 404: not found", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then((res) => {
        expect(res.body.message).toBe("No article found for article_id 99999");
      });
  });
});

describe("PATCH /api/:article_id", () => {
  test("status 201: responds with 201 when successfully updated", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: 1,
      })
      .expect(201)
      .then((res) => {
        expect(res.body.updatedArticle).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          body: "I find this existence challenging",
          votes: 101,
          topic: "mitch",
          author: "butter_bridge",
          created_at: "2020-07-09T20:11:00.000Z",
        });
      });
  });
  //error handling
  describe("PATCH: Error handling", () => {
    test("status 400: bad request; malformed body/missing required fields", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400)
        .then((res) => {
          expect(res.body.message).toBe("Bad request");
        });
    });
    test("status 400: returns bad request when passed the incorrect data type", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "ten" })
        .expect(400)
        .then((res) => {
          expect(res.body.message).toBe("Bad request");
        });
    });
  });
});

describe("GET/api/articles/", () => {
  test("status 200: returns an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toBeInstanceOf(Array);
        res.body.articles.forEach((article) =>
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          })
        );
      });
  });
  test("status 200: returns an array of articles, sorted by a query, with created_at as default", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("status 200: returns an array of articles, ordered by a query", () => {
    return request(app)
      .get("/api/articles?order_by=ASC")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toBeSorted({ coerce: true });
      });
  });
  test("status 200: returns an array of article, filtered by query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((res) => {
        expect(res.body.articles.length).toBe(11);
        expect(
          res.body.articles.every((article) => article.topic === "mitch")
        ).toBe(true);
      });
  });

  describe("GET /api/articles/ - error handling", () => {
    test("status 400: invalid sort query input", () => {
      return request(app)
        .get("/api/articles?sort_by=invalidColumnName")
        .expect(400)
        .then((res) => {
          expect(res.body.message).toBe("Bad request");
        });
    });

    test("status 400: invalid order query input", () => {
      return request(app)
        .get("/api/articles?order_by=invalidOrderQuery")
        .expect(400)
        .then((res) => {
          expect(res.body.message).toBe("Bad request");
        });
    });
    test("status 404: invalid topic input", () => {
      return request(app)
        .get("/api/articles?topic=invalidTopic")
        .expect(404)
        .then((res) => {
          expect(res.body.message).toBe("Status code 404: topic not found");
        });
    });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status 200: returns an array of comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toBeInstanceOf(Array);
        res.body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
  describe("GET /api/articles/:article_id/comments - error handling", () => {
    test("status 200: returns an empty array if article has no comments", () => {
      return request(app)
      .get("/api/articles/8/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toBeInstanceOf(Array)
      })
    })

    test("status 404: invalid sort query input", () => {
      return request(app)
        .get("/api/articles/80808/comments")
        .expect(404)
        .then((res) => {
          expect(res.body.message).toBe("No article found for article_id 80808");
        });
    });
    test("status 400: invalid query type input", () => {
      return request(app)
        .get("/api/articles/invalidInput/comments")
        .expect(400)
        .then((res) => {
          expect(res.body.message).toBe("Bad request");
        });
    } )
  })
});

