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

  describe("getLength", function() {
    it("should reduce group down to length of group", function() {
      expect(groupReducer({name: "getLength"}, mockDataForGrouping)).to.eql({
        card: 3,
        cash: 2,
        loan: 1,
      })
    })
  })
})
