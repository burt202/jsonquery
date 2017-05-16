const React = require("react")
const PropTypes = require("prop-types")
const R = require("ramda")

const dataProcessor = require("../services/data-processor")
const utils = require("../utils")

const Filters = require("./filters")
const Controls = require("./controls")
const Summary = require("./summary")
const Results = require("./results")
const SchemaEdit = require("./schema-edit")

const Query = React.createClass({
  displayName: "Query",

  propTypes: {
    actionCreator: PropTypes.object.isRequired,
    filters: PropTypes.array.isRequired,
    groupings: PropTypes.array,
    sorters: PropTypes.array,
    schema: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    resultFields: PropTypes.array.isRequired,
    showCounts: PropTypes.bool.isRequired,
    limit: PropTypes.number,
    sum: PropTypes.string,
    average: PropTypes.string,
  },

  getInitialState: function() {
    return {
      showSchemaControls: false,
    }
  },

  onReset: function() {
    this.props.actionCreator.reset()
  },

  onSchemaEdit: function() {
    this.setState({showSchemaControls: true})
  },

  filterResults: function(data) {
    return dataProcessor.filter(data, this.props.schema, this.props.filters)
  },

  sortResults: function(data) {
    return (this.props.sorters.length) ? dataProcessor.sort(this.props.sorters, data) : data
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
    if (this.props.groupings.length) return dataProcessor.group(this.props.groupings, this.props.showCounts, data)
    if (this.props.sum) return {total: utils.round(2, R.sum(R.pluck(this.props.sum, data)))}
    if (this.props.average) return {average: utils.round(2, R.mean(R.pluck(this.props.average, data)))}
    return data
  },

  getSideOptions: function() {
    return (
      <ul className="side-options right">
        <li><a className="site-link" onClick={this.onSchemaEdit}>Edit Schema</a></li>
        <li><a className="site-link" onClick={this.onReset}>Reset</a></li>
      </ul>
    )
  },

  onCancel: function() {
    this.setState({showSchemaControls: false})
  },

  onSave: function(schema) {
    this.setState({showSchemaControls: false})
    this.props.actionCreator.saveJson("schema", schema)
  },

  getSchemaControls: function() {
    return (
      <SchemaEdit
        schema={this.props.schema}
        onSave={this.onSave}
        onCancel={this.onCancel}
      />
    )
  },

  render: function() {
    if (this.state.showSchemaControls) return this.getSchemaControls()

    const filtered = this.filterSortAndLimit(this.props.data)
    const results = this.formatData(filtered)

    return (
      <div className="query-cont">
        {this.getSideOptions()}
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
