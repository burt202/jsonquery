const R = require("ramda")

module.exports = {
  round: R.curry((decimals, num) => {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
  }),

  updateWhere(find, update, data) {
    const index = R.findIndex(R.whereEq(find), data)
    return R.adjust(index, R.merge(R.__, update), data)
  },

  getMax(arr) {
    return Math.max.apply(null, arr)
  },

  getMin(arr) {
    return Math.min.apply(null, arr)
  },

  getMode(arr) {
    const modes = []
    const count = []
    let i,
      maxIndex = 0

    for (i = 0; i < arr.length; i += 1) {
      const value = arr[i]
      count[value] = (count[value] || 0) + 1
      if (count[value] > maxIndex) {
        maxIndex = count[value]
      }
    }

    for (i in count) {
      if (count[i] === maxIndex) {
        modes.push(i)
      }
    }

    let formatted = modes

    if (R.all(m => !isNaN(m), modes)) {
      formatted = modes.map(i => Number(i))
    }

    return formatted.length > 1 ? formatted : formatted[0]
  },

  rainbow(count, index) {
    const value = (360 / count) * index
    return `hsl(${value}, 90%, 60%)`
  },

  getCumulative(data) {
    const mapIndexed = R.addIndex(R.map)

    return mapIndexed((val, idx) => {
      return R.compose(R.sum, R.slice(0, idx + 1))(data)
    }, data)
  },
}
