const parse = require("date-fns/parse")
const isValid = require("date-fns/is_valid")

module.exports = {
  isString: function(data) {
    return typeof data === "string"
  },

  isNumber: function(data) {
    return typeof data === "number"
  },

  isBool: function(data) {
    return typeof data === "boolean"
  },

  isValidDate: function(data) {
    return isValid(parse(data))
  },

  isArray: function(data) {
    return Array.isArray(data)
  },

  isObject: function(data) {
    return !Array.isArray(data)
  },

  isValidJSON: function(str) {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }

    return true
  },
}
