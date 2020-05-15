const chai = require("chai")
const expect = chai.expect

const validator = require("../validator")

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

  describe("isValidDate", function() {
    it("should return true when data is a date", function() {
      expect(validator.isValidDate("2009-09")).to.eql(true)
    })

    it("should return false when data is not a date", function() {
      expect(validator.isValidDate("date")).to.eql(false)
    })
  })

  describe("isValidTime", function() {
    it("should return true when data is a time stamp", function() {
      expect(validator.isValidTime("22:16")).to.eql(true)
      expect(validator.isValidTime("10:16")).to.eql(true)
      expect(validator.isValidTime("00:16")).to.eql(true)
      expect(validator.isValidTime("00:16:09")).to.eql(true)
    })

    it("should return false when data is not a time stamp", function() {
      expect(validator.isValidTime("time")).to.eql(false)
      expect(validator.isValidTime("22:66")).to.eql(false)
      expect(validator.isValidTime("22:66a")).to.eql(false)
      expect(validator.isValidTime("0:66a")).to.eql(false)
      expect(validator.isValidTime("24:10")).to.eql(false)
      expect(validator.isValidTime("10:0")).to.eql(false)
      expect(validator.isValidTime("00s:16:09")).to.eql(false)
      expect(validator.isValidTime("00:16:09s")).to.eql(false)
      expect(validator.isValidTime("22:15:98")).to.eql(false)
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
      expect(validator.isValidJSON('{"foo": "bar"}')).to.eql(true)
    })

    it("should return false if string is not json", function() {
      expect(validator.isValidJSON("jhfds")).to.eql(false)
    })
  })

  describe("isStringNumeric", function() {
    it("should return true when string is valid number", function() {
      expect(validator.isStringNumeric("2.12")).to.eql(true)
    })

    it("should return false when string is not valid number", function() {
      expect(validator.isStringNumeric("foo")).to.eql(false)
    })
  })
})
