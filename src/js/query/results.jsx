const React = require("react")
const PropTypes = require("prop-types")

const ResultsSummary = require("./results-summary")
const ResultsDisplay = require("./results-display")

const R = require("ramda")

const dataProcessor = require("../services/data-processor")
const utils = require("../utils")

const Results = React.createClass({
  displayName: "Results",

  propTypes: {
    actionCreator: PropTypes.object.isRequired,
    filters: PropTypes.array.isRequired,
    groupings: PropTypes.array,
    sorters: PropTypes.array,
    schema: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    resultFields: PropTypes.array.isRequired,
    showCounts: PropTypes.bool.isRequired,
    flatten: PropTypes.bool.isRequired,
    groupSort: PropTypes.string.isRequired,
    groupLimit: PropTypes.number,
    limit: PropTypes.number,
    analyse: PropTypes.string,
  },

  filterResults(data) {
    return dataProcessor.filter(data, this.props.schema, this.props.filters)
  },

  sortResults(data) {
    return (this.props.sorters.length) ? dataProcessor.sort(this.props.sorters, data) : data
  },

  limitResults(data) {
    return (this.props.limit) ? R.take(this.props.limit, data) : data
  },

  pickIncludedFields(data) {
    return R.map(R.pickAll(R.sortBy(R.identity, this.props.resultFields)))(data)
  },

  getAnalysis(data) {
    const values = R.pluck(this.props.analyse, data)

    return {
      sum: utils.round(2, R.sum(values)),
      average: utils.round(2, R.mean(values)),
      lowest: utils.getMin(values),
      highest: utils.getMax(values),
      median: utils.round(2, R.median(values)),
    }
  },

  filterSortAndLimit(data) {
    return R.pipe(
      this.filterResults,
      this.sortResults,
      this.limitResults,
      this.pickIncludedFields
    )(data)
  },

  isGroupingSortable() {
    if (this.props.groupings.length === 1 && this.props.showCounts) return true
    if (this.props.groupings.length > 1 && this.props.flatten && this.props.showCounts) return true
    return false
  },

  formatData(data) {
    if (this.props.groupings.length) {
      const grouped = dataProcessor.group(this.props.groupings, this.props.showCounts, this.props.flatten, data)
      return this.isGroupingSortable() ? dataProcessor.sortAndLimitObject(this.props.groupSort, this.props.groupLimit, grouped) : grouped
    }

    if (this.props.analyse) return this.getAnalysis(data)

    return data
  },

  render() {
    const filtered = this.filterSortAndLimit(this.props.data)
    const results = this.formatData(filtered)

    return (
      <div>
        <ResultsSummary
          rawDataLength={this.props.data.length}
          filtered={filtered}
          groupings={this.props.groupings}
          groupSort={this.props.groupSort}
          groupLimit={this.props.groupLimit}
        />
        <ResultsDisplay
          results={results}
          groupings={this.props.groupings}
          resultFields={this.props.resultFields}
          schema={this.props.schema}
          actionCreator={this.props.actionCreator}
          showCounts={this.props.showCounts}
          filteredLength={filtered.length}
          analyse={this.props.analyse}
        />
      </div>
    )
  },
})

module.exports = Results
