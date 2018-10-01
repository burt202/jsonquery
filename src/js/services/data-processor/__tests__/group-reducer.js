const chai = require("chai")
const expect = chai.expect

const groupReducer = require("../group-reducer")

describe("groupReducer", function() {
  const mockDataForGrouping = {
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
  }

  it("should return passed in data if reducer is undefined", function() {
    expect(groupReducer(undefined, mockDataForGrouping)).to.eql(mockDataForGrouping)
  })

  it("should return passed in data if reducer name is not recognised", function() {
    expect(groupReducer({name: "invalid"}, mockDataForGrouping)).to.eql(mockDataForGrouping)
  })

  describe("getLength", function() {
    it("should reduce group down to length of group", function() {
      expect(groupReducer({name: "getLength"}, mockDataForGrouping)).to.eql({
        card: {count: 3, result: 3},
        cash: {count: 2, result: 2},
        loan: {count: 1, result: 1},
      })
    })
  })
})
