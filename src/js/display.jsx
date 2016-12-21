const React = require("react")
const R = require("ramda")

const formatter = require("./formatter")
const Filters = require("./filters")
const Controls = require("./controls")
const Summary = require("./summary")

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

const Display = React.createClass({
  displayName: "Display",

  propTypes: {
    actionCreator: React.PropTypes.object.isRequired,
    filters: React.PropTypes.array.isRequired,
    groupBy: React.PropTypes.string,
    sortBy: React.PropTypes.string,
    sortDirection: React.PropTypes.string,
    schema: React.PropTypes.object.isRequired,
    data: React.PropTypes.array.isRequired,
  },

  onBackClick: function() {
    this.props.actionCreator.goBack()
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
    return (<p>NOTE: results display limited to {FILTER_THRESHOLD}</p>)
  },

  getDownloadText: function(text, json) {
    const types = [
      {name: "JSON", mimetype: "application/json", extension: "json", transformer: prettify},
      {name: "CSV", mimetype: "text/csv", extension: "csv", transformer: convertToCsv},
    ]

    const downloadLinks = types.map(function(type) {
      const data = type.transformer(json)
      const downloader = this.downloadResults.bind(this, data, type.mimetype, type.extension)
      return (<a className="site-link" key={type.name} onClick={downloader}>{type.name}</a>)
    }.bind(this))

    return (<p className="download-links">{text}: {downloadLinks}</p>)
  },

  showResults: function(filtered, grouped) {
    var dataToDisplay = grouped || filtered
    var limitText = null
    var downloadText = this.getDownloadText("Download as", dataToDisplay)

    if (filtered.length > FILTER_THRESHOLD) {
      dataToDisplay = R.take(FILTER_THRESHOLD, filtered)
      if (grouped) dataToDisplay = formatter.group(dataToDisplay, this.props.groupBy)
      limitText = this.getLimitText()
      downloadText = this.getDownloadText("Download the whole lot as", filtered)
    }

    return (
      <div>
        <h3>Results</h3>
        {limitText}
        {downloadText}
        <pre>{JSON.stringify(dataToDisplay, null, 2)}</pre>
        <a id="hidden-download-link" style={{display: "none"}}></a>
      </div>
    )
  },

  render: function() {
    window.scrollTo(0, 0)

    var filtered = formatter.filter(this.props.data, this.props.schema, this.props.filters)
    var grouped = null

    if (this.props.groupBy) {
      grouped = formatter.group(filtered, this.props.groupBy)
    }

    if (this.props.sortBy) {
      filtered = formatter.sort(filtered, this.props.sortBy, this.props.sortDirection)
    }

    return (
      <div>
        <p><a className="site-link" onClick={this.onBackClick}>Go back</a></p>
        <Filters
          actionCreator={this.props.actionCreator}
          filters={this.props.filters}
          schema={this.props.schema}
        />
        <Controls
          actionCreator={this.props.actionCreator}
          filters={this.props.filters}
          schema={this.props.schema}
          groupBy={this.props.groupBy}
          sortBy={this.props.sortBy}
          sortDirection={this.props.sortDirection}
        />
        <Summary
          resultsTotal={filtered.length}
          grouped={grouped}
        />
        {this.showResults(filtered, grouped)}
      </div>
    )
  },
})

module.exports = Display
