const React = require("react")
const PropTypes = require("prop-types")
const R = require("ramda")
const Clipboard = require("clipboard")

const downloadFormatter = require("../services/download-formatter")

const Donut = require("./charts/donut")

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
    sum: PropTypes.string,
    average: PropTypes.string,
  },

  getInitialState: function() {
    return {
      displayMode: "chart",
    }
  },

  downloadResults: function(type) {
    const formatted = type.formatter(this.props.results)

    const dataStr = URL.createObjectURL(new Blob([formatted], {type: type.mimetype}))
    const downloadLink = document.getElementById("hidden-download-link")
    downloadLink.setAttribute("href", dataStr)
    downloadLink.setAttribute("download", new Date().toISOString() + "." + type.extension)
    downloadLink.click()
    downloadLink.setAttribute("href", "")
  },

  getDownloadLinks: function() {
    const sumedOrAveraged = !!(this.props.sum || this.props.average)

    const jsonFormatter = downloadFormatter.json(this.props.groupings, this.props.showCounts, sumedOrAveraged)
    const csvFormatter = downloadFormatter.csv(this.props.groupings, this.props.showCounts, sumedOrAveraged)

    const types = [
      {name: "JSON", mimetype: "application/json", extension: "json", formatter: jsonFormatter},
      {name: "CSV", mimetype: "text/csv", extension: "csv", formatter: csvFormatter},
    ]

    return types.map(function(type) {
      const downloader = this.downloadResults.bind(this, type)
      return (<a className="site-link" key={type.name} onClick={downloader}>{type.name}</a>)
    }.bind(this))
  },

  isAggregateResult: function() {
    return this.props.showCounts || this.props.sum || this.props.average
  },

  tooManyResultToShow: function() {
    return this.props.filteredLength > DISPLAY_THRESHOLD
  },

  getDisplayData: function() {
    if (!this.isAggregateResult() && this.tooManyResultToShow())
      return "Results set too large to display, use download options instead"
    return JSON.stringify(this.props.results, null, 2)
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

  getCheckboxes: function() {
    return (!this.isAggregateResult()) ? <p>Include: {this.getResultFieldOptions()}</p> : null
  },

  canCopyResults: function() {
    return this.props.showCounts || !this.tooManyResultToShow()
  },

  getCopyLink: function() {
    return (this.canCopyResults()) ? <a className="site-link" data-clipboard-action="copy" data-clipboard-target="#copy-cont">Copy to clipboard</a> : null
  },

  onChangeDisplayMode: function(mode) {
    this.setState({displayMode: mode})
  },

  resultsText: function() {
    return (<div>
      {this.getCheckboxes()}
      <p className="download-links">Download results as: {this.getDownloadLinks()}</p>
      <pre>
        {this.getCopyLink()}
        <div id="copy-cont">
          {this.getDisplayData()}
        </div>
      </pre>
      <a id="hidden-download-link" style={{display: "none"}}></a>
    </div>)
  },

  getResults: function() {
    const canShowChart = this.props.groupings.length === 1 && !this.props.showCounts

    return (<div>
      {canShowChart ? <ModeSelector mode={this.state.displayMode} onChange={this.onChangeDisplayMode}/> : undefined}
      {canShowChart && this.state.displayMode === "chart" ? <Donut data={this.props.results}/> : undefined}
      {!canShowChart || this.state.displayMode === "data" ? this.resultsText() : undefined}
    </div>)
  },

  render: function() {
    new Clipboard("pre a")

    return <div>
      <h3>Results</h3>
      {this.getResults()}
    </div>
  },
})

function ModeSelector(props) {
  return (<div>
    {props.mode !== "chart" && <a onClick={function() {
      props.onChange("chart")
    }}>Chart</a>}
    {props.mode !== "data" && <a onClick={function() {
      props.onChange("data")
    }}>Data</a>}
  </div>)
}

ModeSelector.propTypes = {
  mode: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
}

module.exports = Results
