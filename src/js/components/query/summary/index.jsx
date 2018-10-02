const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")
const R = require("ramda")

const dataProcessor = require("../../../services/data-processor")
const summaryAnalyser = require("../../../services/summary-analyser")

const Summary = createReactClass({
  displayName: "ResultsSummary",

  propTypes: {
    rawDataLength: PropTypes.number.isRequired,
    filtered: PropTypes.array.isRequired,
    groupings: PropTypes.array,
    groupSort: PropTypes.string,
    groupLimit: PropTypes.number,
  },

  getGrouping() {
    return (this.props.groupings.length) ? dataProcessor.group(this.props.groupings, this.props.filtered) : null
  },

  getTotal() {
    return {name: "Total", value: this.props.rawDataLength}
  },

  getFilteredTotal() {
    if (this.props.filtered.length === this.props.rawDataLength) return null
    return summaryAnalyser.getFilteredTotal(this.props.filtered, this.props.rawDataLength)
  },

  getGroupLimitedTotal(grouped) {
    if (!this.props.groupings.length || !this.props.groupLimit) return null
    const limitedGroups = dataProcessor.groupProcessor({name: "getLength"}, this.props.groupSort, this.props.groupLimit, false, grouped)
    return summaryAnalyser.getGroupLimitedTotal(this.props.filtered, this.props.rawDataLength, limitedGroups)
  },

  getGroupingAnalysis(grouped) {
    if (!grouped || this.props.groupLimit) return null
    return summaryAnalyser.getGroupingAnalysis(grouped)
  },

  render() {
    const grouped = this.getGrouping()

    const summaryData = [
      this.getTotal(),
      this.getFilteredTotal(),
      this.getGroupLimitedTotal(grouped),
      this.getGroupingAnalysis(grouped),
    ]

    const fields = R.pipe(
      R.flatten,
      R.reject(R.isNil),
      R.map(function(obj) {
        return (<p key={obj.name} title={obj.title}>{`${obj.name}: ${obj.value}`}</p>)
      })
    )(summaryData)

    return (
      <div className="summary-cont">
        <h3>Summary</h3>
        <div className="stats">
          {fields}
        </div>
      </div>
    )
  },
})

module.exports = Summary
