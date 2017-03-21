const chai = require("chai")
const expect = chai.expect

const transformer = require("../../../src/js/helpers/transformer")

describe("transformer", function() {

  describe("convertToCsv", function() {
    it("should return null if data set is empty", function() {
      expect(transformer.convertToCsv([], false, false, [])).to.eql(null)
      expect(transformer.convertToCsv([], false, false, {})).to.eql(null)
    })

    it("should format correctly when array is passed in", function() {
      const mockData = [
        {color: "red", size: 6},
        {color: "blue", size: 5},
      ]

      expect(transformer.convertToCsv([], false, false, mockData)).to.eql(
        "color,size\r\nred,6\r\nblue,5"
      )
    })

    it("should format correctly when grouped data object is passed in", function() {
      const mockData = {
        red: [{color: "red", size: 6}, {color: "red", size: 4}],
        blue: [{color: "blue", size: 5}],
      }

      expect(transformer.convertToCsv(["color"], false, false, mockData)).to.eql(
        "color,size\r\nred\r\nred,6\r\nred,4\r\nblue\r\nblue,5"
      )
    })

    it("should format correctly when a group counts array is passed in", function() {
      const mockData = [
        "red: 2",
        "blue: 1",
      ]

      expect(transformer.convertToCsv(["color"], true, false, mockData)).to.eql(
        "red,2\r\nblue,1"
      )
    })

    it("should format correctly when sumed or averaged", function() {
      const mockData = {
        total: 20,
      }

      expect(transformer.convertToCsv([], false, true, mockData)).to.eql(
        "total,20"
      )
    })
  })
})
