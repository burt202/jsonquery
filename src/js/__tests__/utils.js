const chai = require("chai")
const expect = chai.expect

const utils = require("../utils")

describe("utils", () => {
  describe("round", () => {
    it("should round a number to a certain number of decimals", () => {
      const res = utils.round(2, 1.3456)

      expect(res).to.eql(1.35)
    })
  })

  describe("updateWhere", () => {
    it("should correctly update item in array by criteria passed", () => {
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

  describe("getMin", () => {
    it("should return lowest value from array", () => {
      const res = utils.getMin([2, 4, 5, 2])

      expect(res).to.eql(2)
    })
  })

  describe("getMax", () => {
    it("should return highest value from array", () => {
      const res = utils.getMax([2, 4, 5, 2])

      expect(res).to.eql(5)
    })
  })

  describe("getMode", () => {
    it("should return the most common value from array", () => {
      const res = utils.getMode([2, 4, 5, 2])

      expect(res).to.eql(2)
    })

    it("should return the most common values from array if there is a joint winner", () => {
      const res = utils.getMode([2, 4, 5, 2, 5])

      expect(res).to.eql([2, 5])
    })

    it("should return the most common value from array if items are strings", () => {
      const res = utils.getMode(["pear", "apple", "grapes", "apple"])

      expect(res).to.eql("apple")
    })
  })

  describe("rainbow", () => {
    it("should return hsl colour string", () => {
      const res = utils.rainbow(10, 5)

      expect(res).to.eql("hsl(180, 90%, 60%)")
    })
  })

  describe("getCumulative", () => {
    it("should return array values in cumulative state", () => {
      const res = utils.getCumulative([2, 4, 1, 6, 8])

      expect(res).to.eql([2, 6, 7, 13, 21])
    })
  })
})
