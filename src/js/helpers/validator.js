module.exports = {
  isArray: function(data) {
    if (Array.isArray(data)) return true
    return false
  },

  isObject: function(data) {
    if (!Array.isArray(data)) return true
    return false
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

