const chai = require("chai")
const expect = chai.expect

const analyse = require("../analyse")

describe("analyse", () => {
  describe("string", () => {
    const mockData = [
      {name: "Tom", favouriteColour: "blue"},
      {name: "Ben", favouriteColour: "pink"},
      {name: "Matt", favouriteColour: "purple"},
      {name: "Dan", favouriteColour: "red"},
      {name: "Steve", favouriteColour: "red"},
      {name: "Harry", favouriteColour: "blue"},
    ]

    it("should analyse a string field", () => {
      expect(analyse("string", "favouriteColour", mockData)).to.eql({
        mostCommonValue: ["blue", "red"],
        uniqueValues: ["blue", "pink", "purple", "red"],
      })
    })
  })

  describe("number", () => {
    const mockData = [
      {name: "Tom", score: 20},
      {name: "Ben", score: 12},
      {name: "Matt", score: 12},
      {name: "Dan", score: 9},
      {name: "Steve", score: 16},
      {name: "Harry", score: 17},
    ]

    it("should analyse a number field", () => {
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
  describe("date", () => {
    const mockData = [
      {name: "Tom", dob: "1998-08-24T09:32:00.000Z"},
      {name: "Ben", dob: "2015-08-24T09:32:00.000Z"},
      {name: "Matt", dob: "1986-08-24T09:32:00.000Z"},
    ]

    it("should analyse a date field", () => {
      expect(analyse("date", "dob", mockData)).to.eql({
        earliestDate: "1986-08-24T09:32:00.000Z",
        latestDate: "2015-08-24T09:32:00.000Z",
      })
    })
  })

  describe("array", () => {
    const mockData = [
      {name: "Tom", siblingNames: ["Pat", "Steve", "Rich"]},
      {name: "Ben", siblingNames: ["Paul"]},
      {name: "Matt", siblingNames: ["Steve", "Sue"]},
    ]

    it("should analyse a date field", () => {
      expect(analyse("array", "siblingNames", mockData)).to.eql({
        highestLength: 3,
        averageLength: 2,
        mostCommonValue: "Steve",
      })
    })
  })
})
