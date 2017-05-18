exports.rainbow = function(count, index) {
  return "hsl(" + 360 / count * index + ", 90%, 60%)"
}

const rangeMin = 30
const rangeMax = 90
const range = rangeMax - rangeMin
const defaultSettings = {
  hue: 200,
}
exports.shade = function(count, index, settings) {
  const hue = (settings || defaultSettings).hue

  return "hsl(" + hue + ", 100%, " + ((range / count * index) + rangeMin) + "%)"
}
