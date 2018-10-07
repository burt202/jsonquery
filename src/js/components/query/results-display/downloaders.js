const R = require("ramda")

module.exports = function() {

  return {
    base: R.curry(function(extension, mimetype, formatted) {
      const dataStr = URL.createObjectURL(new Blob([formatted], {type: mimetype}))

      const downloadLink = document.getElementById("hidden-download-link")
      downloadLink.setAttribute("href", dataStr)
      downloadLink.setAttribute("download", `${new Date().toISOString()}.${extension}`)
      downloadLink.click()
      downloadLink.setAttribute("href", "")
    }),
    chart: R.curry(function(extension, mimetype, chart) {
      const svgURL = new XMLSerializer().serializeToString(chart)
      const svgBlob = new Blob([svgURL], {type: `${mimetype};charset=utf-8"`})
      const dataStr = URL.createObjectURL(svgBlob)

      const downloadLink = document.getElementById("hidden-download-link")
      downloadLink.setAttribute("href", dataStr)
      downloadLink.setAttribute("download", `${new Date().toISOString()}.${extension}`)
      downloadLink.click()
      downloadLink.setAttribute("href", "")
    }),
  }
}
