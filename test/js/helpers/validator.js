const chai = require("chai")
const expect = chai.expect

const validator = require("../../../src/js/helpers/validator")

describe("validator", function() {

  describe("isString", function() {
    it("should return true when data is string", function() {
      expect(validator.isString("dd")).to.eql(true)
    })

    it("should return false when data is not string", function() {
      expect(validator.isString({})).to.eql(false)
    })
  })

  describe("isNumber", function() {
    it("should return true when data is number", function() {
      expect(validator.isNumber(33)).to.eql(true)
    })

    it("should return false when data is not number", function() {
      expect(validator.isNumber({})).to.eql(false)
    })
  })

  describe("isBool", function() {
    it("should return true when data is boolean", function() {
      expect(validator.isBool(true)).to.eql(true)
    })

    it("should return false when data is not boolean", function() {
      expect(validator.isBool({})).to.eql(false)
    })
  })

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
