const getCount = require("../utils/index")

describe("getCount", () => {
    test("returns a number", () => {
        expect(typeof getCount(1)).toBe("number")
    })
    test("returns the comment count on an article ", () => {
        expect(getCount(1)).toBe(11)
    })
})