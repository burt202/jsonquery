const chai = require("chai")
const expect = chai.expect

const utils = require("../src/js/utils")

describe("utils", function() {

  describe("round", function() {
    it("should round a number to a certain number of decimals", function() {
      const res = utils.round(2, 1.3456)

      expect(res).to.eql(1.35)
    })
  })

  describe("updateWhere", function() {
    it("should correctly update item in array by criteria passed", function() {
      const data = [
        {id: 1, name: "foo"},
        {id: 2, name: "bar"},
      ]

      const res = utils.updateWhere({id: 2}, {name: "XXX"}, data)

      expect(res).to.eql([
        {id: 1, name: "foo"},
        {id: 2, name: "XXX"},
      ])
    })
  })

  describe("getMin", function() {
    it("should return lowest value from array", function() {
      const res = utils.getMin([2, 4, 5, 2])

      expect(res).to.eql(2)
    })
  })

  describe("getMax", function() {
    it("should return highest value from array", function() {
      const res = utils.getMax([2, 4, 5, 2])

      expect(res).to.eql(5)
    })
  })
})
