const React = require("react")
const R = require("ramda")

const transformer = require("../helpers/transformer")

const DISPLAY_THRESHOLD = 1000

const Results = React.createClass({
  displayName: "Results",

  propTypes: {
    results: React.PropTypes.any.isRequired,
    groupBy: React.PropTypes.string,
    resultFields: React.PropTypes.array.isRequired,
    schema: React.PropTypes.object.isRequired,
    actionCreator: React.PropTypes.object.isRequired,
    showCounts: React.PropTypes.bool.isRequired,
    filteredLength: React.PropTypes.number.isRequired,
  },

  downloadResults: function(data, mimetype, extension) {
    const dataStr = URL.createObjectURL(new Blob([data], {type: mimetype}))
    const downloadLink = document.getElementById("hidden-download-link")
    downloadLink.setAttribute("href", dataStr)
    downloadLink.setAttribute("download", new Date().toISOString() + "." + extension)
    downloadLink.click()
    downloadLink.setAttribute("href", "")
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

  resultsTooLarge: function() {
    return (this.props.filteredLength > DISPLAY_THRESHOLD) && !this.props.showCounts
  },

  getDisplayData: function(data) {
    if (this.resultsTooLarge()) return "Results set too large to display, use download options instead"
    return JSON.stringify(data, null, 2)
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
      const disabled = (field === this.props.groupBy)

      return (
        <label className="result-field" key={field}>
          <input type="checkbox" name={field} disabled={disabled} checked={checked} onChange={this.onChangeHandler} />
          {field}
        </label>
      )
    }.bind(this))
  },

  render: function() {
    const dataToDownload = this.props.results
    const dataToDisplay = this.getDisplayData(dataToDownload)
    const includeCheckboxes = (!this.props.showCounts) ? <p>Include: {this.getResultFieldOptions()}</p> : null

    return (
      <div>
        <h3>Results</h3>
        {includeCheckboxes}
        <p className="download-links">Download results as: {this.getDownloadLinks(dataToDownload)}</p>
        <pre>{dataToDisplay}</pre>
        <a id="hidden-download-link" style={{display: "none"}}></a>
      </div>
    )
  },
})

module.exports = Results
