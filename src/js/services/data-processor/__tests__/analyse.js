const chai = require("chai")
const expect = chai.expect

const analyse = require("../analyse")

describe("analyse", function() {
  describe("number", function() {
    const mockData = [
      {name: "Tom", score: 20},
      {name: "Ben", score: 12},
      {name: "Matt", score: 12},
      {name: "Dan", score: 9},
      {name: "Steve", score: 16},
      {name: "Harry", score: 17},
    ]

    it("should analyse a number field", function() {
      expect(analyse("number", "score", mockData)).to.eql({
        lowest: 9,
        highest: 20,
        sum: 86,
        average: 14.33,
        median: 14,
        mode: 12,
      })
    })
  })
})
