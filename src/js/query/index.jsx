const React = require("react")
const R = require("ramda")

const formatter = require("../helpers/formatter")

const Filters = require("./filters")
const Controls = require("./controls")
const Summary = require("./summary")
const Results = require("./results")

const Query = React.createClass({
  displayName: "Query",

  propTypes: {
    actionCreator: React.PropTypes.object.isRequired,
    filters: React.PropTypes.array.isRequired,
    groupings: React.PropTypes.array,
    sorters: React.PropTypes.array,
    schema: React.PropTypes.object.isRequired,
    data: React.PropTypes.array.isRequired,
    resultFields: React.PropTypes.array.isRequired,
    showCounts: React.PropTypes.bool.isRequired,
    limit: React.PropTypes.number,
    sum: React.PropTypes.string,
    average: React.PropTypes.string,
  },

  onReset: function() {
    this.props.actionCreator.reset()
  },

  filterResults: function(data) {
    return formatter.filter(data, this.props.schema, this.props.filters)
  },

  sortResults: function(data) {
    return (this.props.sorters.length) ? formatter.sort(this.props.sorters, data) : data
  },

  limitResults: function(data) {
    return (this.props.limit) ? R.take(this.props.limit, data) : data
  },

  pickIncludedFields: function(data) {
    return R.map(R.pickAll(R.sortBy(R.identity, this.props.resultFields)))(data)
  },

  filterSortAndLimit: function(data) {
    return R.pipe(
      this.filterResults,
      this.sortResults,
      this.limitResults,
      this.pickIncludedFields
    )(data)
  },

  formatData: function(data) {
    if (this.props.groupings.length) return formatter.group(this.props.groupings, this.props.showCounts, data)
    if (this.props.sum) return {total: formatter.round(2, R.sum(R.pluck(this.props.sum, data)))}
    if (this.props.average) return {average: formatter.round(2, R.mean(R.pluck(this.props.average, data)))}
    return data
  },

  getResetControl: function() {
    return (
      <p><a className="site-link" onClick={this.onReset}>Reset</a></p>
    )
  },

  render: function() {
    const filtered = this.filterSortAndLimit(this.props.data)
    const results = this.formatData(filtered)

    return (
      <div>
        {this.getResetControl()}
        <Filters
          actionCreator={this.props.actionCreator}
          filters={this.props.filters}
          schema={this.props.schema}
        />
        <Controls
          actionCreator={this.props.actionCreator}
          schema={this.props.schema}
          groupings={this.props.groupings}
          sorters={this.props.sorters}
          showCounts={this.props.showCounts}
          limit={this.props.limit}
          sum={this.props.sum}
          average={this.props.average}
        />
        <Summary
          rawDataLength={this.props.data.length}
          results={filtered}
          groupings={this.props.groupings}
        />
        <Results
          results={results}
          groupings={this.props.groupings}
          resultFields={this.props.resultFields}
          schema={this.props.schema}
          actionCreator={this.props.actionCreator}
          showCounts={this.props.showCounts}
          filteredLength={filtered.length}
          sum={this.props.sum}
          average={this.props.average}
        />
      </div>
    )
  },
})

module.exports = Query
