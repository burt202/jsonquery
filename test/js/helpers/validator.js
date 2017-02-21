const chai = require("chai")
const expect = chai.expect

const validator = require("../../../src/js/helpers/validator")

describe("validator", function() {

  describe("isArray", function() {
    it("should return true when data is array", function() {
      expect(validator.isArray(["foo"])).to.eql(true)
    })

    it("should return false when data is not array", function() {
      expect(validator.isArray({})).to.eql(false)
    })
  })

  describe("isObject", function() {
    it("should return true when data is object", function() {
      expect(validator.isObject({})).to.eql(true)
    })

    it("should return false when data is not object", function() {
      expect(validator.isObject(["foo"])).to.eql(false)
    })
  })

  describe("isValidJSON", function() {
    it("should return true if string is json", function() {
      expect(validator.isValidJSON("{\"foo\": \"bar\"}")).to.eql(true)
    })

    it("should return false if string is not json", function() {
      expect(validator.isValidJSON("jhfds")).to.eql(false)
    })
  })
})
