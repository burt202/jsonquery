const chai = require("chai")
const expect = chai.expect

const groupLimiter = require("../group-limiter")

describe("groupLimiter", function() {
  const mockDataForLimiting = [
    {name: "card - true", reducer: 2},
    {name: "cash - true", reducer: 1},
    {name: "loan - true", reducer: 1},
    {name: "cash - false", reducer: 1},
    {name: "card - false", reducer: 1},
    {name: "loan - false", reducer: 1},
  ]

  it("should return passed in data if limit is undefined", function() {
    expect(groupLimiter(undefined, false, mockDataForLimiting)).to.eql(mockDataForLimiting)
  })

  it("should limit group", function() {
    expect(groupLimiter(3, false, mockDataForLimiting)).to.eql([
      {name: "card - true", reducer: 2},
      {name: "cash - true", reducer: 1},
      {name: "loan - true", reducer: 1},
    ])
  })

  it("should limit group and combine remainder", function() {
    expect(groupLimiter(3, true, mockDataForLimiting)).to.eql([
      {name: "card - true", reducer: 2},
      {name: "cash - true", reducer: 1},
      {name: "loan - true", reducer: 1},
      {name: "Other", reducer: 3},
    ])
  })
})
