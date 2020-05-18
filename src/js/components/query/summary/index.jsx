const React = require("react")
const PropTypes = require("prop-types")

const R = require("ramda")

const dataProcessor = require("../../../services/data-processor")
const summaryAnalyser = require("../../../services/summary-analyser")

function Summary(props) {
  const getGrouping = () => {
    return props.groupings.length ? dataProcessor.group(props.groupings, props.filtered) : null
  }

  const getTotal = () => {
    return {name: "Total", value: props.rawDataLength}
  }

  const getFilteredTotal = () => {
    if (props.filtered.length === props.rawDataLength) return null
    return summaryAnalyser.getFilteredTotal(props.filtered, props.rawDataLength)
  }

  const getGroupLimitedTotal = grouped => {
    if (!props.groupings.length || !props.groupLimit) return null
    const limitedGroups = dataProcessor.groupProcessor(
      props.schema,
      {name: "count"},
      props.groupSort,
      props.groupLimit,
      false,
      grouped,
    )
    return summaryAnalyser.getGroupLimitedTotal(props.filtered, props.rawDataLength, limitedGroups)
  }

  const getGroupingAnalysis = grouped => {
    if (!grouped || props.groupLimit) return null
    return summaryAnalyser.getGroupingAnalysis(grouped)
  }

  const grouped = getGrouping()

  const summaryData = [
    getTotal(),
    getFilteredTotal(),
    getGroupLimitedTotal(grouped),
    getGroupingAnalysis(grouped),
  ]

  const fields = R.pipe(
    R.flatten,
    R.reject(R.isNil),
    R.map(function(obj) {
      return <p key={obj.name} title={obj.title}>{`${obj.name}: ${obj.value}`}</p>
    }),
  )(summaryData)

  return (
    <div className="summary-cont">
      <h3>Summary</h3>
      <div className="stats">{fields}</div>
    </div>
  )
}

Summary.propTypes = {
  rawDataLength: PropTypes.number.isRequired,
  filtered: PropTypes.array.isRequired,
  groupings: PropTypes.array,
  groupSort: PropTypes.string,
  groupLimit: PropTypes.number,
  schema: PropTypes.object.isRequired,
}

module.exports = Summary
