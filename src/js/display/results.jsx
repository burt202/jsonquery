const React = require("react")
const R = require("ramda")

const formatter = require("../helpers/formatter")
const transformer = require("../helpers/transformer")

const FILTER_THRESHOLD = 500

const Results = React.createClass({
  displayName: "Results",

  propTypes: {
    results: React.PropTypes.array.isRequired,
    groupBy: React.PropTypes.string,
    sortBy: React.PropTypes.string,
    sortDirection: React.PropTypes.string,
    resultFields: React.PropTypes.array.isRequired,
    schema: React.PropTypes.object.isRequired,
    actionCreator: React.PropTypes.object.isRequired,
    showCounts: React.PropTypes.bool.isRequired,
  },

  limitDisplayData: function() {
    return (this.props.results.length > FILTER_THRESHOLD) && !this.props.showCounts
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
    if (!this.limitDisplayData()) return null
    return (<p>NOTE: results display limited to {FILTER_THRESHOLD}</p>)
  },

  getDownloadLinks: function(data) {
    const types = [
      {name: "JSON", mimetype: "application/json", extension: "json", transformer: transformer.prettify(this.props.groupBy, this.props.showCounts)},
      {name: "CSV", mimetype: "text/csv", extension: "csv", transformer: transformer.convertToCsv(this.props.groupBy, this.props.showCounts)},
    ]

    return types.map(function(type) {
      const transformed = type.transformer(data)
      const downloader = this.downloadResults.bind(this, transformed, type.mimetype, type.extension)
      return (<a className="site-link" key={type.name} onClick={downloader}>{type.name}</a>)
    }.bind(this))
  },

  getDownloadText: function(data) {
    var text = (this.limitDisplayData()) ? "Download the whole lot as" : "Download as"
    return (<p className="download-links">{text}: {this.getDownloadLinks(data)}</p>)
  },

  groupSortData: function(data) {
    data = R.map(R.pick(this.props.resultFields))(data)
    if (this.props.groupBy) return formatter.group([this.props.groupBy], this.props.showCounts, data)
    if (this.props.sortBy) return formatter.sort(data, this.props.sortBy, this.props.sortDirection)
    return data
  },

  getDisplayData: function() {
    const data = this.limitDisplayData() ? R.take(FILTER_THRESHOLD, this.props.results) : this.props.results
    return this.groupSortData(data)
  },

  onChangeHandler: function(e) {
    const field = e.target.name
    const isPresent = R.contains(field, this.props.resultFields)
    const updatedFields = (isPresent) ?
      R.without([field], this.props.resultFields) :
      R.append(field, this.props.resultFields)

    this.props.actionCreator.updateResultFields(updatedFields)
  },

  getResultFieldOptions: function() {
    return R.keys(this.props.schema).map(function(field) {
      const checked = R.contains(field, this.props.resultFields)

      return (
        <label className="result-field" key={field}>
          <input type="checkbox" name={field} checked={checked} onChange={this.onChangeHandler} />
          {field}
        </label>
      )
    }.bind(this))
  },

  render: function() {
    const dataToDisplay = this.getDisplayData()
    const dataToDownload = this.groupSortData(this.props.results)

    const includeCheckboxes = (!this.props.showCounts) ? <p>Include: {this.getResultFieldOptions()}</p> : null

    return (
      <div>
        <h3>Results</h3>
        {this.getLimitText()}
        {includeCheckboxes}
        {this.getDownloadText(dataToDownload)}
        <pre>{JSON.stringify(dataToDisplay, null, 2)}</pre>
        <a id="hidden-download-link" style={{display: "none"}}></a>
      </div>
    )
  },
})

module.exports = Results
