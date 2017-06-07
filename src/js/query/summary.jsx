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
    filtered: PropTypes.array.isRequired,
    groupings: PropTypes.array,
    groupLimit: PropTypes.number,
  },

  getGrouping() {
    return (this.props.groupings.length) ? dataProcessor.group(this.props.groupings, false, false, this.props.filtered) : null
  },

  getFilteredTotal() {
    if (this.props.filtered.length === this.props.rawDataLength) return null
    const percentage = utils.round(2, (this.props.filtered.length / this.props.rawDataLength) * 100)
    return <p>Filtered: {this.props.filtered.length} ({percentage}%)</p>
  },

  getGroupLimitedTotal(grouped) {
    if (!this.props.groupings.length || !this.props.groupLimit) return null
    const res = dataProcessor.sortAndLimitObject("desc", this.props.groupLimit, grouped)
    const groupedTotal = R.compose(R.length, R.flatten, R.pluck("count"))(res)
    const absolutePercentage = utils.round(2, (groupedTotal / this.props.rawDataLength) * 100)
    const relativePercentage = utils.round(2, (groupedTotal / this.props.filtered.length) * 100)
    const relativePercentageTitle = `Relative to filtered data: ${relativePercentage}%`
    return <p title={relativePercentageTitle}>Group Limited: {groupedTotal} ({absolutePercentage}%)</p>
  },

  getGroupingBreakdown(grouped) {
    if (!grouped || this.props.groupLimit) return null

    return R.map(function(obj) {
      return (<p key={obj.name}>{`${obj.name}: ${obj.value}`}</p>)
    }, groupingAnalyser.getAnalysis(grouped))
  },

  render() {
    const grouped = this.getGrouping()

    return (
      <div>
        <h3 className="summary">Summary</h3>
        <div className="summary-stats">
          <p>Total: {this.props.rawDataLength}</p>
          {this.getFilteredTotal()}
          {this.getGroupLimitedTotal(grouped)}
          {this.getGroupingBreakdown(grouped)}
        </div>
      </div>
    )
  },
})

module.exports = Summary
