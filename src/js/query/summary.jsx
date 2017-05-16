const React = require("react")
const PropTypes = require("prop-types")
const R = require("ramda")

const dataProcessor = require("../services/data-processor")
const groupingAnalyser = require("../services/grouping-analyser")
const utils = require("../utils")

const Summary = React.createClass({
  displayName: "Summary",

  propTypes: {
    rawDataLength: PropTypes.number.isRequired,
    results: PropTypes.array.isRequired,
    groupings: PropTypes.array,
  },

  getGroupingBreakdown: function(grouping) {
    if (!grouping) return null

    return R.map(function(obj) {
      return (<p key={obj.name}>{obj.name + ": " + obj.value}</p>)
    }, groupingAnalyser.getAnalysis(grouping))
  },

  getGrouping: function() {
    return (this.props.groupings.length) ? dataProcessor.group(this.props.groupings, false, this.props.results) : null
  },

  showRawDataLength: function() {
    if (this.props.results.length === this.props.rawDataLength) return ""
    const percentage = (this.props.results.length / this.props.rawDataLength) * 100
    return "/" + this.props.rawDataLength + " (" + utils.round(2, percentage) + "%)"
  },

  render: function() {
    const grouping = this.getGrouping()

    return (
      <div>
        <h3 className="summary">Summary</h3>
        <div className="summary-stats">
          <p>Total: {this.props.results.length}{this.showRawDataLength()}</p>
          {this.getGroupingBreakdown(grouping)}
        </div>
      </div>
    )
  },
})

module.exports = Summary
