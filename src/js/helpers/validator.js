module.exports = {
  isValidType: function(type, data) {
    if (type === "object" && !Array.isArray(data)) return true
    if (type === "array" && Array.isArray(data)) return true
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

