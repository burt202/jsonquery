const React = require("react")
const PropTypes = require("prop-types")
const R = require("ramda")
const classNames = require("classnames")

const downloadFormatter = require("../services/download-formatter")
const validator = require("../services/validator")

const JsonDisplay = require("./results-display-json")
const TableDisplay = require("./results-display-table")
const ChartDisplay = require("./results-display-chart")

const DISPLAY_THRESHOLD = 1000

const Results = React.createClass({
  displayName: "ResultsDisplay",

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
    const types = [
      {name: "JSON", view: "json", extension: "json", mimetype: "application/json", downloadable: true, component: JsonDisplay},
      {name: "Table", view: "table", extension: "csv", mimetype: "text/csv", downloadable: true, component: TableDisplay},
    ]

    if (this.props.groupings.length && this.props.showCounts) {
      types.push({name: "Chart", view: "chart", extension: "png", mimetype: "image/png", downloadable: false, component: ChartDisplay})
    }

    return types
  },

  getViewTypesLinks() {
    return this.getViewTypes().map(function(type) {
      const classnames = classNames({
        "active": this.state.type === type.view,
      })

      return (
        <li key={type.view} className={classnames}>
          <a className="site-link" onClick={this.setType.bind(this, type.view)}>{type.name}</a>
        </li>
      )
    }.bind(this))
  },

  downloadResults() {
    const type = R.find(R.propEq("view", this.state.type), this.getViewTypes())
    const formatted = downloadFormatter[type.extension](this.props.groupings, this.props.showCounts, this.props.results)

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
    const type = R.find(R.propEq("view", this.state.type), this.getViewTypes())

    if (!this.isAggregateResult() && this.tooManyResultToShow()) {
      return <JsonDisplay data={`Results set too large to display, use download link for .${type.extension} file`} />
    }

    if (validator.isString(this.props.results)) return <JsonDisplay data={this.props.results} />

    const formatted = downloadFormatter[this.state.type] ? downloadFormatter[this.state.type](this.props.groupings, this.props.showCounts, this.props.results) : this.props.results
    const Component = type.component
    return <Component data={formatted} />
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

  getDownloadLink() {
    const type = R.find(R.propEq("view", this.state.type), this.getViewTypes())
    if (!type.downloadable) return null

    return (
      <ul className="side-options right">
        <li><a className="site-link" onClick={this.downloadResults}>Download</a></li>
      </ul>
    )
  },

  render() {
    return (
      <div className="results-cont">
        <h3>Results</h3>
        {this.getCheckboxes()}

        <div className="results-options">
          <ul className="side-options">
            {this.getViewTypesLinks()}
          </ul>
          {this.getDownloadLink()}
        </div>

        {this.getDisplayData()}
        <a id="hidden-download-link" style={{display: "none"}}></a>
      </div>
    )
  },
})

module.exports = Results
