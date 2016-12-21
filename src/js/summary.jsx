const React = require("react")
const R = require("ramda")

const formatter = require("./formatter")

const Summary = React.createClass({
  displayName: "Summary",

  propTypes: {
    resultsTotal: React.PropTypes.number.isRequired,
    grouped: React.PropTypes.array,
  },

  getGroupingBreakdown: function() {
    if (!this.props.grouped) return "None"

    return R.pipe(
      R.toPairs,
      R.map(R.last),
      R.map(function(obj) {
        return obj.name + ": " + obj.value
      }),
      R.join(", ")
    )(formatter.getGroupStats(this.props.grouped))
  },

  getFormattedGroups: function() {
    if (!this.props.grouped) return null

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
    )(this.props.grouped)
  },

  render: function() {
    return (
      <div>
        <h3>Summary</h3>
        <p>Total: {this.props.resultsTotal}</p>
        <p><u><strong>Groups</strong></u></p>
        <p>{this.getGroupingBreakdown()}</p>
        <p>{this.getFormattedGroups()}</p>
      </div>
    )
  },
})

module.exports = Summary
