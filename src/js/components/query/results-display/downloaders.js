const R = require("ramda")

const downloadFormatter = require("../../../services/download-formatter")

module.exports = function(groupings, groupReducer) {

  return {
    base: R.curry(function(extension, mimetype, results) {
      const formatted = downloadFormatter[extension](groupings, groupReducer, results)
      const dataStr = URL.createObjectURL(new Blob([formatted], {type: mimetype}))

      const downloadLink = document.getElementById("hidden-download-link")
      downloadLink.setAttribute("href", dataStr)
      downloadLink.setAttribute("download", `${new Date().toISOString()}.${extension}`)
      downloadLink.click()
      downloadLink.setAttribute("href", "")
    }),
    chart: R.curry(function(extension, mimetype, chart) {
      const width = chart.ctx.canvas.width
      const height = chart.ctx.canvas.height

      const newCanvas = document.createElement("canvas")
      newCanvas.width = width
      newCanvas.height = height

      const ctx = newCanvas.getContext("2d")
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(chart.ctx.canvas, 0, 0)

      const dataStr = newCanvas.toDataURL()

      const downloadLink = document.getElementById("hidden-download-link")
      downloadLink.setAttribute("href", dataStr)
      downloadLink.setAttribute("download", `${new Date().toISOString()}.${extension}`)
      downloadLink.click()
      downloadLink.setAttribute("href", "")
    }),
  }
}
