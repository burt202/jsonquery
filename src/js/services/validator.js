const parse = require("date-fns/parse")
const isValid = require("date-fns/is_valid")

module.exports = {
  isString(data) {
    return typeof data === "string"
  },

  isNumber(data) {
    return typeof data === "number"
  },

  isBool(data) {
    return typeof data === "boolean"
  },

  isValidDate(data) {
    return /^([0-9]{4})-([0-9]{2})/.test(data) && isValid(parse(data))
  },

  isValidTime(data) {
    return /^([01]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/.test(data)
  },

  isArray(data) {
    return Array.isArray(data)
  },

  isObject(data) {
    return !Array.isArray(data)
  },

  isValidJSON(str) {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }

    return true
  },
}
