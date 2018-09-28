const chai = require("chai")
const expect = chai.expect

const grouper = require("../grouper")

describe("grouper", function() {
  const mockDataForGrouping = [
    {name: "foo", type: "cash", auto: true},
    {name: "bar", type: "cash", auto: false},
    {name: "baz", type: "loan", auto: true},
    {name: "abc", type: "card", auto: true},
    {name: "123", type: "card", auto: false},
    {name: "test", type: "card", auto: true},
  ]

  it("should group data at 1 level", function() {
    expect(grouper(["type"], false, mockDataForGrouping)).to.eql({
      cash: [
        {name: "foo", type: "cash", auto: true},
        {name: "bar", type: "cash", auto: false},
      ],
      loan: [
        {name: "baz", type: "loan", auto: true},
      ],
      card: [
        {name: "abc", type: "card", auto: true},
        {name: "123", type: "card", auto: false},
        {name: "test", type: "card", auto: true},
      ],
    })
  })

  it("should group data at 2 levels", function() {
    expect(grouper(["type", "auto"], false, mockDataForGrouping)).to.eql({
      "cash - true": [{name: "foo", type: "cash", auto: true}],
      "cash - false": [{name: "bar", type: "cash", auto: false}],
      "loan - true": [{name: "baz", type: "loan", auto: true}],
      "card - true": [{name: "abc", type: "card", auto: true}, {name: "test", type: "card", auto: true}],
      "card - false": [{name: "123", type: "card", auto: false}],
    })
  })

  it("should group data at 1 level with counts", function() {
    expect(grouper(["type"], true, mockDataForGrouping)).to.eql({
      card: 3,
      cash: 2,
      loan: 1,
    })
  })

  it("should group data at 2 levels with counts", function() {
    expect(grouper(["type", "auto"], true, mockDataForGrouping)).to.eql({
      "cash - false": 1,
      "cash - true": 1,
      "loan - true": 1,
      "card - true": 2,
      "card - false": 1,
    })
  })
})
