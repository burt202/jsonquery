const React = require("react")
const R = require("ramda")

const formatter = require("../services/formatter")

const Summary = React.createClass({
  displayName: "Summary",

  propTypes: {
    rawDataLength: React.PropTypes.number.isRequired,
    results: React.PropTypes.array.isRequired,
    groupings: React.PropTypes.array,
  },

  getGroupingBreakdown: function(grouping) {
    if (!grouping) return null

    return R.map(function(obj) {
      return (<p key={obj.name}>{obj.name + ": " + obj.value}</p>)
    }, formatter.getGroupStats(grouping))
  },

  getGrouping: function() {
    return (this.props.groupings.length) ? formatter.group(this.props.groupings, false, this.props.results) : null
  },

  showRawDataLength: function() {
    if (this.props.results.length === this.props.rawDataLength) return ""
    const percentage = (this.props.results.length / this.props.rawDataLength) * 100
    return "/" + this.props.rawDataLength + " (" + formatter.round(2, percentage) + "%)"
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
