const React = require("react")
const PropTypes = require("prop-types")
const R = require("ramda")
const Clipboard = require("clipboard")
const classNames = require("classnames")

const downloadFormatter = require("../services/download-formatter")
const Code = require("../components/code")

const DISPLAY_THRESHOLD = 1000

const TYPES = [
  {name: "JSON", value: "json", extension: "json", mimetype: "application/json"},
  {name: "Table", value: "table", extension: "csv", mimetype: "text/csv"},
]

const display = {
  json(data) {
    return (
      <div id="copy-cont">
        <Code language="json">
          {data}
        </Code>
      </div>
    )
  },
  table(data) {
    const rows = data.split("\r\n")
    const headerCols = rows[0].split(",")

    const headerRow = headerCols.map(function(col, index) {
      return <th key={index}>{col}</th>
    })

    const dataRows = R.tail(rows).map(function(row, index) {
      const colSplit = row.split(",")

      const cols = (colSplit.length === 1)
        ? <td colSpan={headerCols.length} style={{fontWeight: "bold"}}>{colSplit[0]}</td>
        : colSplit.map(function(col, index) {
          return <td key={index}>{col}</td>
        })

      return <tr key={index}>{cols}</tr>
    })

    return (
      <table className="table">
        <thead>
          <tr>{headerRow}</tr>
        </thead>
        <tbody>
          {dataRows}
        </tbody>
      </table>
    )
  },
}

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

  getInitialState() {
    return {
      type: "json",
    }
  },

  setType(type) {
    this.setState({type})
  },

  getViewTypes() {
    return TYPES.map(function(type) {
      const classnames = classNames({
        "active": this.state.type === type.value,
      })

      return (
        <li key={type.value} className={classnames}>
          <a className="site-link" onClick={this.setType.bind(this, type.value)}>{type.name}</a>
        </li>
      )
    }.bind(this))
  },

  downloadResults() {
    const type = R.find(R.propEq("value", this.state.type), TYPES)
    const formatted = downloadFormatter[this.state.type](this.props.groupings, this.props.showCounts, this.props.results)

    const dataStr = URL.createObjectURL(new Blob([formatted], {type: type.mimetype}))
    const downloadLink = document.getElementById("hidden-download-link")
    downloadLink.setAttribute("href", dataStr)
    downloadLink.setAttribute("download", `${new Date().toISOString()}.${type.extension}`)
    downloadLink.click()
    downloadLink.setAttribute("href", "")
  },

  isAggregateResult() {
    return this.props.showCounts || this.props.analyse
  },

  tooManyResultToShow() {
    return this.props.filteredLength > DISPLAY_THRESHOLD
  },

  getDisplayData() {
    if (!this.isAggregateResult() && this.tooManyResultToShow())
      return display.json("Results set too large to display, use download options instead")

    const formatted = downloadFormatter[this.state.type](this.props.groupings, this.props.showCounts, this.props.results)
    return display[this.state.type](formatted)
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
        <label className="checkbox-label" key={field}>
          <input type="checkbox" name={field} disabled={disabled} checked={checked} onChange={this.onChangeHandler} />
          {field}
        </label>
      )
    }.bind(this))
  },

  getCheckboxes() {
    return (!this.isAggregateResult()) ? <div className="include-checkboxes"><span className="label">Include:</span><span>{this.getResultFieldOptions()}</span></div> : null
  },

  canCopyResults() {
    return this.state.type === "json" && (this.props.showCounts || !this.tooManyResultToShow())
  },

  getCopyLink() {
    return (this.canCopyResults()) ? <li><a className="site-link" data-clipboard-action="copy" data-clipboard-target="#copy-cont">Copy To Clipboard</a></li> : null
  },

  render() {
    new Clipboard("a.site-link[data-clipboard-action='copy']")

    return (
      <div>
        <h3>Results</h3>
        {this.getCheckboxes()}

        <div className="results-options">
          <ul className="side-options">
            {this.getViewTypes()}
          </ul>
          <ul className="side-options right">
            {this.getCopyLink()}
            <li><a className="site-link" onClick={this.downloadResults}>Download</a></li>
          </ul>
        </div>

        {this.getDisplayData()}
        <a id="hidden-download-link" style={{display: "none"}}></a>
      </div>
    )
  },
})

module.exports = Results
