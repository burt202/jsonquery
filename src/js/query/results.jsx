const React = require("react")
const PropTypes = require("prop-types")
const R = require("ramda")
const Clipboard = require("clipboard")

const downloadFormatter = require("../services/download-formatter")
const Code = require("../components/code")

const DISPLAY_THRESHOLD = 1000

const Results = React.createClass({
  displayName: "Results",

  propTypes: {
    results: PropTypes.any.isRequired,
    groupings: PropTypes.array,
    resultFields: PropTypes.array.isRequired,
    schema: PropTypes.object.isRequired,
    actionCreator: PropTypes.object.isRequired,
    showCounts: PropTypes.bool.isRequired,
    filteredLength: PropTypes.number.isRequired,
    analyse: PropTypes.string,
  },

  downloadResults(type) {
    const formatted = type.formatter(this.props.results)

    const dataStr = URL.createObjectURL(new Blob([formatted], {type: type.mimetype}))
    const downloadLink = document.getElementById("hidden-download-link")
    downloadLink.setAttribute("href", dataStr)
    downloadLink.setAttribute("download", `${new Date().toISOString()}.${type.extension}`)
    downloadLink.click()
    downloadLink.setAttribute("href", "")
  },

  getDownloadLinks() {
    const jsonFormatter = downloadFormatter.json(this.props.groupings, this.props.showCounts)
    const csvFormatter = downloadFormatter.csv(this.props.groupings, this.props.showCounts)

    const types = [
      {name: "JSON", mimetype: "application/json", extension: "json", formatter: jsonFormatter},
      {name: "CSV", mimetype: "text/csv", extension: "csv", formatter: csvFormatter},
    ]

    return types.map(function(type) {
      const downloader = this.downloadResults.bind(this, type)
      return (<a className="site-link" key={type.name} onClick={downloader}>{type.name}</a>)
    }.bind(this))
  },

  isAggregateResult() {
    return this.props.showCounts || this.props.analyse
  },

  tooManyResultToShow() {
    return this.props.filteredLength > DISPLAY_THRESHOLD
  },

  getDisplayData() {
    if (!this.isAggregateResult() && this.tooManyResultToShow())
      return "Results set too large to display, use download options instead"
    return JSON.stringify(this.props.results, null, 2)
  },

  onChangeHandler(e) {
    const field = e.target.name
    const isPresent = R.contains(field, this.props.resultFields)
    const updatedFields = (isPresent) ?
      R.without([field], this.props.resultFields) :
      R.append(field, this.props.resultFields)

    this.props.actionCreator.updateResultFields(updatedFields)
  },

  getResultFieldOptions() {
    const schemaKeys = R.sortBy(R.identity, R.keys(this.props.schema))

    return schemaKeys.map(function(field) {
      const checked = R.contains(field, this.props.resultFields)
      const disabled = R.contains(field, this.props.groupings)

      return (
        <label className="result-field" key={field}>
          <input type="checkbox" name={field} disabled={disabled} checked={checked} onChange={this.onChangeHandler} />
          {field}
        </label>
      )
    }.bind(this))
  },

  getCheckboxes() {
    return (!this.isAggregateResult()) ? <p>Include: {this.getResultFieldOptions()}</p> : null
  },

  canCopyResults() {
    return this.props.showCounts || !this.tooManyResultToShow()
  },

  getCopyLink() {
    return (this.canCopyResults()) ? <a className="site-link" data-clipboard-action="copy" data-clipboard-target="#copy-cont">Copy to clipboard</a> : null
  },

  render() {
    new Clipboard("a.site-link[data-clipboard-action='copy']")

    return (
      <div>
        <h3>Results</h3>
        {this.getCheckboxes()}
        <p className="download-links">
          Download results as: {this.getDownloadLinks()}
          {this.getCopyLink()}
        </p>
        <div id="copy-cont">
          <Code language="json">
            {this.getDisplayData()}
          </Code>
        </div>
        <a id="hidden-download-link" style={{display: "none"}}></a>
      </div>
    )
  },
})

module.exports = Results
