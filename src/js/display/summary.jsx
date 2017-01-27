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
    if (!grouping) return "None"

    return R.pipe(
      R.toPairs,
      R.map(R.last),
      R.map(function(obj) {
        return obj.name + ": " + obj.value
      }),
      R.join(", ")
    )(formatter.getGroupStats(grouping))
  },

  getFormattedGroups: function(grouping) {
    if (!grouping) return null

    return R.pipe(
      R.toPairs,
      R.map(function(pair) {
        return {name: pair[0], total: pair[1].length}
      }),
      R.sortBy(R.prop("total")),
      R.reverse,
      R.map(function(group) {
        return group.name + " (" + group.total + ")"
      }),
      R.join(", ")
    )(grouping)
  },

  getGrouping: function() {
    return (this.props.groupBy) ? formatter.group(this.props.results, this.props.groupBy) : null
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
        <h3>Summary</h3>
        <p>Total: {this.props.results.length}{this.showRawDataLength()}</p>
        <p><u><strong>Groups</strong></u></p>
        <p>{this.getGroupingBreakdown(grouping)}</p>
        <p>{this.getFormattedGroups(grouping)}</p>
      </div>
    )
  },
})

module.exports = Summary
