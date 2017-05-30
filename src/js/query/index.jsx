const React = require("react")
const PropTypes = require("prop-types")
const R = require("ramda")

const dataProcessor = require("../services/data-processor")
const utils = require("../utils")

const Layout = require("../components/layout")

const Filters = require("./filters")
const Controls = require("./controls")
const Summary = require("./summary")
const Results = require("./results")
const SchemaEdit = require("./schema-edit")

const {default: RaisedButton} = require("material-ui/FlatButton")
const {default: Divider} = require("material-ui/Divider")

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
    analyse: PropTypes.string,
  },

  getInitialState() {
    return {
      showSchemaControls: false,
    }
  },

  onReset() {
    this.props.actionCreator.reset()
  },

  onSchemaEdit() {
    this.setState({showSchemaControls: true})
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
      analyse: utils.round(2, R.analyse(values)),
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

  formatData(data) {
    if (this.props.groupings.length) return dataProcessor.group(this.props.groupings, this.props.showCounts, data)
    if (this.props.analyse) return this.getAnalysis(data)
    return data
  },

  getSideOptions() {
    const canReset = this.props.filters.length
      || this.props.groupings.length
      || this.props.sorters.length
      || this.props.analyse
      || this.props.limit

    return <div style={{display: "flex", justifyContent: "space-between"}}>
      <RaisedButton secondary label="Edit schema" onTouchTap={this.onSchemaEdit}/>
      <RaisedButton disabled={!canReset} secondary label="Reset" onTouchTap={this.onReset}/>
    </div>
  },

  onCancel() {
    this.setState({showSchemaControls: false})
  },

  onSave(schema) {
    this.setState({showSchemaControls: false})
    this.props.actionCreator.saveJson("schema", schema)
  },

  getSchemaControls() {
    return (
      <SchemaEdit
        schema={this.props.schema}
        onSave={this.onSave}
        onCancel={this.onCancel}
      />
    )
  },

  render() {
    if (this.state.showSchemaControls) return this.getSchemaControls()

    const filtered = this.filterSortAndLimit(this.props.data)
    const results = this.formatData(filtered)

    return (
      <Layout
        left = {<div>

          {this.getSideOptions()}
          <Divider/>

          <Filters
            actionCreator={this.props.actionCreator}
            filters={this.props.filters}
            schema={this.props.schema}
          />

          <Divider/>

          <Controls
            actionCreator={this.props.actionCreator}
            schema={this.props.schema}
            groupings={this.props.groupings}
            sorters={this.props.sorters}
            showCounts={this.props.showCounts}
            limit={this.props.limit}
            analyse={this.props.analyse}
          />

        </div>}
        right = {<div>
          <Summary
            rawDataLength={this.props.data.length}
            results={filtered}
            groupings={this.props.groupings}
          />
          <Divider/>
          <Results
            results={results}
            groupings={this.props.groupings}
            resultFields={this.props.resultFields}
            schema={this.props.schema}
            actionCreator={this.props.actionCreator}
            showCounts={this.props.showCounts}
            filteredLength={filtered.length}
            analyse={this.props.analyse}
          />
      </div>}
      />
    )
  },
})

module.exports = Query
