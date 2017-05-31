const React = require("react")
const PropTypes = require("prop-types")
const R = require("ramda")

const Inset = require("../components/inset")
const SpaceAfter = require("../components/space-after")

const {default: Subheader} = require("material-ui/Subheader")
const {default: Chip} = require("material-ui/Chip")

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

  getGroupingBreakdown(grouping) {
    if (!grouping) return null

    return R.map(
      ({name, value}) => <Stat label={name} value={value} key={name}/>,
      groupingAnalyser.getAnalysis(grouping)
    )
  },

  getGrouping() {
    return (this.props.groupings.length) ? dataProcessor.group(this.props.groupings, false, this.props.results) : null
  },

  showRawDataLength() {
    if (this.props.results.length === this.props.rawDataLength) return ""
    const percentage = (this.props.results.length / this.props.rawDataLength) * 100
    return `/${this.props.rawDataLength} (${utils.round(2, percentage)}%)`
  },

  render() {
    const grouping = this.getGrouping()

    return (
      <div>
        <Subheader>Summary</Subheader>
        <Inset vertical={false}>
          <SpaceAfter>
            <div style={{display: "flex", flexWrap: "wrap"}}>
              <Stat label="Total" value={this.props.results.length + this.showRawDataLength()}/>
              {this.getGroupingBreakdown(grouping)}
            </div>
          </SpaceAfter>
        </Inset>
      </div>
    )
  },
})

module.exports = Summary

const style = {marginRight: 8, marginBottom: 8}
function Stat({label, value}) {
  return <Chip style={style}>{label}: {value}</Chip>
}

Stat.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.node.isRequired,
}
