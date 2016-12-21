const React = require("react")
const R = require("ramda")

const formatter = require("../helpers/formatter")

const FILTER_THRESHOLD = 500

function prettify(json) {
  return JSON.stringify(json, null, 2)
}

function convertToCsv(json) {
  if (!json.length) return null
  const header = R.keys(json[0]).join(",")

  return R.pipe(
    R.map(function(row) {
      return R.values(row).join(",")
    }),
    R.prepend(header),
    R.join("\r\n")
  )(json)
}

const Results = React.createClass({
  displayName: "Results",

  propTypes: {
    results: React.PropTypes.array.isRequired,
    groupBy: React.PropTypes.string,
    sortBy: React.PropTypes.string,
    sortDirection: React.PropTypes.string,
  },

  isAboveResultsThreshold: function() {
    return this.props.results.length > FILTER_THRESHOLD
  },

  downloadResults: function(data, mimetype, extension) {
    const dataStr = URL.createObjectURL(new Blob([data], {type: mimetype}))
    const downloadLink = document.getElementById("hidden-download-link")
    downloadLink.setAttribute("href", dataStr)
    downloadLink.setAttribute("download", new Date().toISOString() + "." + extension)
    downloadLink.click()
    downloadLink.setAttribute("href", "")
  },

  getLimitText: function() {
    if (!this.isAboveResultsThreshold()) return null
    return (<p>NOTE: results display limited to {FILTER_THRESHOLD}</p>)
  },

  getDownloadLinks: function(data) {
    const types = [
      {name: "JSON", mimetype: "application/json", extension: "json", transformer: prettify},
      {name: "CSV", mimetype: "text/csv", extension: "csv", transformer: convertToCsv},
    ]

    return types.map(function(type) {
      const transformed = type.transformer(data)
      const downloader = this.downloadResults.bind(this, transformed, type.mimetype, type.extension)
      return (<a className="site-link" key={type.name} onClick={downloader}>{type.name}</a>)
    }.bind(this))
  },

  getDownloadText: function(data) {
    var text = (this.isAboveResultsThreshold()) ? "Download the whole lot as" : "Download as"
    return (<p className="download-links">{text}: {this.getDownloadLinks(data)}</p>)
  },

  groupSortData: function(data) {
    if (this.props.groupBy) return formatter.group(data, this.props.groupBy)
    if (this.props.sortBy) return formatter.sort(data, this.props.sortBy, this.props.sortDirection)
    return data
  },

  getDisplayData: function() {
    const data = (this.isAboveResultsThreshold()) ? R.take(FILTER_THRESHOLD, this.props.results) : this.props.results
    return this.groupSortData(data)
  },

  render: function() {
    const dataToDisplay = this.getDisplayData()
    const dataToDownload = this.groupSortData(this.props.results)

    return (
      <div>
        <h3>Results</h3>
        {this.getLimitText()}
        {this.getDownloadText(dataToDownload)}
        <pre>{JSON.stringify(dataToDisplay, null, 2)}</pre>
        <a id="hidden-download-link" style={{display: "none"}}></a>
      </div>
    )
  },
})

module.exports = Results
