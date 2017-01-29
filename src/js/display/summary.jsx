const React = require("react")
const R = require("ramda")

const formatter = require("../helpers/formatter")

const round = R.curry(function(decimals, num) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
})

const Summary = React.createClass({
  displayName: "Summary",

  propTypes: {
    rawDataLength: React.PropTypes.number.isRequired,
    results: React.PropTypes.array.isRequired,
    groupBy: React.PropTypes.string,
  },

  getGroupingBreakdown: function(grouping) {
    if (!grouping) return null

    return R.pipe(
      R.toPairs,
      R.map(R.last),
      R.map(function(obj) {
        return (<p key={obj.name}>{obj.name + ": " + obj.value}</p>)
      })
    )(formatter.getGroupStats(grouping))
  },

  getGrouping: function() {
    return (this.props.groupBy) ? formatter.group([this.props.groupBy], false, this.props.results) : null
  },

  showRawDataLength: function() {
    if (this.props.results.length === this.props.rawDataLength) return ""
    const percentage = (this.props.results.length / this.props.rawDataLength) * 100
    return "/" + this.props.rawDataLength + " (" + round(2, percentage) + "%)"
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
