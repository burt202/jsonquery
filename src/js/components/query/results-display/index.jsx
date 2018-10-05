const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")
const R = require("ramda")
const classNames = require("classnames")

const downloadFormatter = require("../../../services/download-formatter")
const validator = require("../../../services/validator")
const dataProcessor = require("../../../services/data-processor")

const JsonDisplay = require("./json")
const TableDisplay = require("./table")
const ChartDisplay = require("./chart")

const getDownloaders = require("./downloaders")
const Code = require("../../shared/code")

const DISPLAY_THRESHOLD = 1000

const Results = createReactClass({
  displayName: "ResultsDisplay",

  propTypes: {
    filtered: PropTypes.array.isRequired,
    filteredLength: PropTypes.number.isRequired,
    groupings: PropTypes.array,
    resultFields: PropTypes.array.isRequired,
    schema: PropTypes.object.isRequired,
    actionCreator: PropTypes.object.isRequired,
    groupReducer: PropTypes.object,
    analyse: PropTypes.string,
    groupSort: PropTypes.string.isRequired,
    groupLimit: PropTypes.number,
    combineRemainder: PropTypes.bool.isRequired,
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
    const downloaders = getDownloaders()

    return {
      json: {name: "JSON", extension: "json", downloader: downloaders.base("json", "application/json"), component: JsonDisplay},
      table: {name: "Table", extension: "csv", downloader: downloaders.base("csv", "text/csv"), component: TableDisplay},
      chart: {name: "Chart (BETA)", extension: "png", downloader: downloaders.chart("png", "image/png"), component: ChartDisplay},
    }
  },

  getViewTypesLinks() {
    return R.toPairs(this.getViewTypes()).map(function(pair) {
      const classnames = classNames({
        "active": this.state.type === pair[0],
      })

      return (
        <li key={pair[0]} className={classnames}>
          <a className="site-link" onClick={this.setType.bind(this, pair[0])}>{pair[1].name}</a>
        </li>
      )
    }.bind(this))
  },

  showToast() {
    const actionCreator = this.props.actionCreator

    actionCreator.showToast("Copied!")

    setTimeout(function() {
      actionCreator.removeToast()
    }, 3000)
  },

  isAggregateResult() {
    return this.props.groupReducer || this.props.analyse
  },

  tooManyResultToShow() {
    return this.props.filteredLength > DISPLAY_THRESHOLD
  },

  getDisplayData(results) {
    const viewTypes = this.getViewTypes()
    const type = viewTypes[this.state.type]

    if (validator.isString(results)) return <Code language="json">{results}</Code>

    if (this.state.type === "chart" && (!this.props.groupings.length || !this.props.groupReducer)) {
      return <Code language="json">You must select a grouping with a reducer to use the charts display</Code>
    }

    if (this.state.type === "chart" && this.props.groupings.length > 1) {
      return <Code language="json">Currently only one level of grouping is supported in the charts display</Code>
    }

    const downloadFormat = downloadFormatter[type.extension] ? (this.props.groupings, this.props.groupReducer, results) : results

    if (!this.isAggregateResult() && this.tooManyResultToShow()) {
      return (
        <JsonDisplay
          formatted={`Results set too large to display, use download link for .${type.extension} file`}
          downloadFormat={downloadFormat}
          onDownload={viewTypes[this.state.type].downloader}
        />
      )
    }

    const formatted = downloadFormatter[this.state.type] ? downloadFormatter[this.state.type](this.props.groupings, this.props.groupReducer, results) : results

    const Component = type.component
    return <Component formatted={formatted} downloadFormat={downloadFormat} onDownload={type.downloader} showToast={this.showToast} />
  },

  formatData(data) {
    if (this.props.groupings.length) {
      const grouped = dataProcessor.group(this.props.groupings, data)
      return this.props.groupReducer ? dataProcessor.groupProcessor(this.props.schema, this.props.groupReducer, this.props.groupSort, this.props.groupLimit, this.props.combineRemainder, grouped) : grouped
    }

    if (this.props.analyse) return dataProcessor.analyse(this.props.analyse, data)

    return data
  },

  render() {
    const results = this.formatData(this.props.filtered)

    return (
      <div className="results-cont">
        <h3>Results</h3>
        <div className="results-options">
          <ul className="side-options">
            {this.getViewTypesLinks()}
          </ul>
        </div>
        {this.getDisplayData(results)}
        <a id="hidden-download-link" style={{display: "none"}}></a>
      </div>
    )
  },
})

module.exports = Results
