const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")
const R = require("ramda")
const classNames = require("classnames")

const downloadFormatter = require("../../services/download-formatter")
const validator = require("../../services/validator")

const JsonDisplay = require("./results-display-json")
const TableDisplay = require("./results-display-table")
const ChartDisplay = require("./results-display-chart")

const dataProcessor = require("../../services/data-processor")

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
    return [
      {name: "JSON", view: "json", extension: "json", mimetype: "application/json", downloader: this.baseDownloader, component: JsonDisplay},
      {name: "Table", view: "table", extension: "csv", mimetype: "text/csv", downloader: this.baseDownloader, component: TableDisplay},
      {name: "Chart", view: "chart", extension: "png", mimetype: "image/png", downloader: this.chartDownloader, component: ChartDisplay},
    ]
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

  onCopy() {
    const actionCreator = this.props.actionCreator

    actionCreator.showToast("Copied!")

    setTimeout(function() {
      actionCreator.removeToast()
    }, 3000)
  },

  baseDownloader(results) {
    return function() {
      const type = R.find(R.propEq("view", this.state.type), this.getViewTypes())

      const formatted = downloadFormatter[type.extension](this.props.groupings, this.props.groupReducer, results)
      const dataStr = URL.createObjectURL(new Blob([formatted], {type: type.mimetype}))

      const downloadLink = document.getElementById("hidden-download-link")
      downloadLink.setAttribute("href", dataStr)
      downloadLink.setAttribute("download", `${new Date().toISOString()}.${type.extension}`)
      downloadLink.click()
      downloadLink.setAttribute("href", "")
    }
  },

  chartDownloader(chart) {
    const type = R.find(R.propEq("view", this.state.type), this.getViewTypes())

    const width = chart.ctx.canvas.width
    const height = chart.ctx.canvas.height

    const newCanvas = document.createElement("canvas")
    newCanvas.width = width
    newCanvas.height = height

    const ctx = newCanvas.getContext("2d")
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(chart.ctx.canvas, 0, 0)

    const dataStr = newCanvas.toDataURL()

    const downloadLink = document.getElementById("hidden-download-link")
    downloadLink.setAttribute("href", dataStr)
    downloadLink.setAttribute("download", `${new Date().toISOString()}.${type.extension}`)
    downloadLink.click()
    downloadLink.setAttribute("href", "")
  },

  isAggregateResult() {
    return this.props.groupReducer || this.props.analyse
  },

  tooManyResultToShow() {
    return this.props.filteredLength > DISPLAY_THRESHOLD
  },

  getDisplayData(results) {
    const type = R.find(R.propEq("view", this.state.type), this.getViewTypes(this.props))

    if (validator.isString(results)) return <JsonDisplay data={results} />

    if (type.view === "chart" && (!this.props.groupings.length || !this.props.groupReducer)) {
      return <JsonDisplay data="You must select a grouping with counts to use the charts display" />
    }

    if (type.view === "chart" && this.props.groupings.length > 1) {
      return <JsonDisplay data="Currently only one level of grouping is supported in the charts display" />
    }

    if (!this.isAggregateResult() && this.tooManyResultToShow()) {
      return (
        <JsonDisplay
          data={`Results set too large to display, use download link for .${type.extension} file`}
          onDownload={this.baseDownloader(results)}
        />
      )
    }

    const formatted = downloadFormatter[this.state.type] ? downloadFormatter[this.state.type](this.props.groupings, this.props.groupReducer, results) : results
    const Component = type.component
    return <Component data={formatted} onDownload={type.downloader} filteredLength={this.props.filteredLength} onCopy={this.onCopy} />
  },

  formatData(data) {
    if (this.props.groupings.length) {
      const grouped = dataProcessor.group(this.props.groupings, data)
      return this.props.groupReducer ? dataProcessor.groupProcessor(this.props.groupReducer, this.props.groupSort, this.props.groupLimit, this.props.combineRemainder, grouped) : grouped
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
