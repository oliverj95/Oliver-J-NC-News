const checkExists = require("../utils/index")
const db = require("../db/connection")


describe("checkExists", () => {
    test("returns a number", () => {
        checkExists(articles, topic, cats)
        expect(res.body.articles).toEqual({
            title: 'UNCOVERED: catspiracy to bring down democracy',
            topic: 'cats',
            author: 'rogersop',
            body: 'Bastet walks amongst us, and the cats are taking arms!',
            created_at: new Date(1596464040000),
            votes: 0
          })
    })
})