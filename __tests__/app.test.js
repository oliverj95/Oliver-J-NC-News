const request = require("supertest");

const db = require("../db/connection.js");

const testData = require("../db/data/test-data/index.js");

const seed = require("../db/seeds/seed.js");

const app = require("../app");
const endpoints = require("../endpoints.json");

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
        expect(res.body.message).toBe("Status code 404: Not Found");
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
  test("status 404: Not Found", () => {
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
          expect(res.body.message).toBe("Status code 404: topic Not Found");
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
          expect(res.body.comments).toBeInstanceOf(Array);
        });
    });

    test("status 404: invalid sort query input", () => {
      return request(app)
        .get("/api/articles/80808/comments")
        .expect(404)
        .then((res) => {
          expect(res.body.message).toBe(
            "No article found for article_id 80808"
          );
        });
    });
    test("status 400: invalid query type input", () => {
      return request(app)
        .get("/api/articles/invalidInput/comments")
        .expect(400)
        .then((res) => {
          expect(res.body.message).toBe("Bad request");
        });
    });
  });
});

describe("POST /api/articles/article:_id/comments", () => {
  test("status 201: returns a response of a successfully posted comment", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        username: "icellusedkars",
        body: "Pretty, pretty, pretty good!",
      })
      .expect(201)
      .then((res) => {
        expect(res.body.newComment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
        });
      });
  });
  describe("POST /api/articles/article:_id/comments - error handling", () => {
    test("status 400: invalid article_id input", () => {
      return request(app)
        .post("/api/articles/invalidInput/comments")
        .send({
          username: "butter_bridge",
          body: "Random comment",
        })
        .expect(400)
        .then((res) => {
          expect(res.body.message).toBe("Bad request");
        });
    });
    test("status 400: malformed body ", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({})
        .expect(400)
        .then((res) => {
          expect(res.body.message).toBe("Bad request");
        });
    });
    test("status 400: schema validation error", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          hello: "butter_bridge",
          hello: "Random comment",
        })
        .expect(400)
        .then((res) => {
          expect(res.body.message).toBe("Bad request");
        });
    });
    test("status 404: article_id does not exist", () => {
      return request(app)
        .post("/api/articles/8080808/comments")
        .expect(404)
        .send({
          username: "butter_bridge",
          body: "Random comment",
        })
        .then((res) => {
          expect(res.body.message).toBe("No article found");
        });
    });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("status 204: deletes the comment  and has no content in the comment_id ", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  describe("DELETE /api/comments/:comment_id - error handling", () => {
    test("status 400: invalid comment id input", () => {
      return request(app)
        .delete("/api/comments/invalid_comment_id")
        .expect(400)
        .then((res) => {
          expect(res.body.message).toBe("Bad request");
        });
    });
    test("status 404: comment id does not exist", () => {
      return request(app)
        .delete("/api/comments/90909090")
        .expect(404)
        .then((res) => {
          expect(res.body.message).toBe("Not Found");
        });
    });
  });
});

describe.only("GET /api", () => {
  test("status 200 and responds with a  JSON of all endpoints", () => {
    return request(app)
    .get("/api")
    .expect(200)
    .then((res) => {
      expect(res.body).toEqual(endpoints)
    })
  })
});
