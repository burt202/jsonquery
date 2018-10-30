const chai = require("chai")
const expect = chai.expect

const analyse = require("../analyse")

describe("analyse", function() {
  const mockData = [
    {name: "Tom", score: 20},
    {name: "Ben", score: 12},
    {name: "Matt", score: 11},
    {name: "Dan", score: 9},
    {name: "Steve", score: 18},
    {name: "Harry", score: 17},
  ]

  describe("number", function() {
    it("should analyse a number field", function() {
      expect(analyse("number", "score", mockData)).to.eql({
        average: 14.5,
        highest: 20,
        lowest: 9,
        median: 14.5,
        sum: 87,
      })
    })
  })
})
