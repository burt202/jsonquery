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

  it("should return passed in data if groupings is undefined", function() {
    expect(grouper(undefined, mockDataForGrouping)).to.eql(mockDataForGrouping)
  })

  it("should return passed in data if groupings length is 0", function() {
    expect(grouper([], mockDataForGrouping)).to.eql(mockDataForGrouping)
  })

  it("should group data at 1 level", function() {
    expect(grouper(["type"], mockDataForGrouping)).to.eql({
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
    expect(grouper(["type", "auto"], mockDataForGrouping)).to.eql({
      "cash - true": [{name: "foo", type: "cash", auto: true}],
      "cash - false": [{name: "bar", type: "cash", auto: false}],
      "loan - true": [{name: "baz", type: "loan", auto: true}],
      "card - true": [{name: "abc", type: "card", auto: true}, {name: "test", type: "card", auto: true}],
      "card - false": [{name: "123", type: "card", auto: false}],
    })
  })
})
