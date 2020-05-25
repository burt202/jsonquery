const chai = require("chai")
const expect = chai.expect

const validator = require("../validator")

describe("validator", () => {
  describe("isString", () => {
    it("should return true when data is string", () => {
      expect(validator.isString("dd")).to.eql(true)
    })

    it("should return false when data is not string", () => {
      expect(validator.isString({})).to.eql(false)
    })
  })

  describe("isNumber", () => {
    it("should return true when data is number", () => {
      expect(validator.isNumber(33)).to.eql(true)
    })

    it("should return false when data is not number", () => {
      expect(validator.isNumber({})).to.eql(false)
    })
  })

  describe("isBool", () => {
    it("should return true when data is boolean", () => {
      expect(validator.isBool(true)).to.eql(true)
    })

    it("should return false when data is not boolean", () => {
      expect(validator.isBool({})).to.eql(false)
    })
  })

  describe("isValidDate", () => {
    it("should return true when data is a date", () => {
      expect(validator.isValidDate("2009-09")).to.eql(true)
    })

    it("should return false when data is not a date", () => {
      expect(validator.isValidDate("date")).to.eql(false)
    })
  })

  describe("isValidTime", () => {
    it("should return true when data is a time stamp", () => {
      expect(validator.isValidTime("22:16")).to.eql(true)
      expect(validator.isValidTime("10:16")).to.eql(true)
      expect(validator.isValidTime("00:16")).to.eql(true)
      expect(validator.isValidTime("00:16:09")).to.eql(true)
    })

    it("should return false when data is not a time stamp", () => {
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

  describe("isArray", () => {
    it("should return true when data is array", () => {
      expect(validator.isArray(["foo"])).to.eql(true)
    })

    it("should return false when data is not array", () => {
      expect(validator.isArray({})).to.eql(false)
    })
  })

  describe("isObject", () => {
    it("should return true when data is object", () => {
      expect(validator.isObject({})).to.eql(true)
    })

    it("should return false when data is not object", () => {
      expect(validator.isObject(["foo"])).to.eql(false)
    })
  })

  describe("isValidJSON", () => {
    it("should return true if string is json", () => {
      expect(validator.isValidJSON('{"foo": "bar"}')).to.eql(true)
    })

    it("should return false if string is not json", () => {
      expect(validator.isValidJSON("jhfds")).to.eql(false)
    })
  })

  describe("isStringNumeric", () => {
    it("should return true when string is valid number", () => {
      expect(validator.isStringNumeric("2.12")).to.eql(true)
    })

    it("should return false when string is not valid number", () => {
      expect(validator.isStringNumeric("foo")).to.eql(false)
    })
  })
})
