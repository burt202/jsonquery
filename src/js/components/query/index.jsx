const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")

const R = require("ramda")

const dataProcessor = require("../../services/data-processor")

const SchemaEdit = require("../schema-edit")
const AddCalculations = require("../add-calculations")

const Filters = require("./filters")
const Controls = require("./controls")
const IncludeFields = require("./include-fields")
const Summary = require("./summary")
const ResultsDisplay = require("./results-display")

const Query = createReactClass({
  displayName: "Query",

  propTypes: {
    actionCreator: PropTypes.object.isRequired,
    filters: PropTypes.array.isRequired,
    groupings: PropTypes.array,
    sorters: PropTypes.array,
    schema: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    calculatedFields: PropTypes.array.isRequired,
    calculationsString: PropTypes.string,
    resultFields: PropTypes.array.isRequired,
    groupReducer: PropTypes.object,
    groupSort: PropTypes.string.isRequired,
    groupLimit: PropTypes.number,
    limit: PropTypes.number,
    analyse: PropTypes.string,
    combineRemainder: PropTypes.bool.isRequired,
  },

  getInitialState() {
    return {
      selectedPage: "query",
    }
  },

  onReset() {
    this.props.actionCreator.reset()
  },

  onCancel() {
    this.setState({selectedPage: "query"})
  },

  onSchemaEditSave(schema) {
    this.setState({selectedPage: "query"})
    this.props.actionCreator.saveJson("schema", schema)
  },

  onAddCalculationSave(schema, data, calculationsString, calculatedFields) {
    this.setState({selectedPage: "query"})
    this.props.actionCreator.saveJson("data", data)
    this.props.actionCreator.saveJson("schema", schema)
    this.props.actionCreator.saveCalculatedFields(calculatedFields)
    this.props.actionCreator.saveCalculationsString(calculationsString)
  },

  getEditSchemaComponent() {
    return (
      <SchemaEdit
        schema={this.props.schema}
        onSave={this.onSchemaEditSave}
        onCancel={this.onCancel}
      />
    )
  },

  getAddCalculationComponent() {
    return (
      <AddCalculations
        data={this.props.data}
        schema={this.props.schema}
        calculatedFields={this.props.calculatedFields}
        calculationsString={this.props.calculationsString}
        onSave={this.onAddCalculationSave}
        onCancel={this.onCancel}
      />
    )
  },

  filterResults(data) {
    return dataProcessor.filter(data, this.props.schema, this.props.filters)
  },

  sortResults(data) {
    return (this.props.sorters.length) ? dataProcessor.sort(this.props.sorters, data) : data
  },

  limitResults(data) {
    return (this.props.limit) ? dataProcessor.limit(this.props.limit, data) : data
  },

  pickIncludedFields(data) {
    return R.map(R.pickAll(R.sortBy(R.identity, this.props.resultFields)))(data)
  },

  filterSortAndLimit(data) {
    return R.pipe(
      this.filterResults,
      this.sortResults,
      this.limitResults,
      this.pickIncludedFields
    )(data)
  },

  render() {
    if (this.state.selectedPage === "editSchema") return this.getEditSchemaComponent()
    if (this.state.selectedPage === "addCalc") return this.getAddCalculationComponent()

    const filtered = this.filterSortAndLimit(this.props.data)

    return (
      <div className="query-cont">
        <ul className="side-options right">
          <li><a className="site-link" onClick={() => this.setState({selectedPage: "addCalc"})}>Add Calculations</a></li>
          <li><a className="site-link" onClick={() => this.setState({selectedPage: "editSchema"})}>Edit Schema</a></li>
          <li><a className="site-link" onClick={this.onReset}>Reset</a></li>
        </ul>
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
          groupReducer={this.props.groupReducer}
          groupSort={this.props.groupSort}
          groupLimit={this.props.groupLimit}
          limit={this.props.limit}
          analyse={this.props.analyse}
          combineRemainder={this.props.combineRemainder}
        />
        <IncludeFields
          groupings={this.props.groupings}
          resultFields={this.props.resultFields}
          schema={this.props.schema}
          actionCreator={this.props.actionCreator}
          groupReducer={this.props.groupReducer}
          analyse={this.props.analyse}
        />
        <Summary
          rawDataLength={this.props.data.length}
          filtered={filtered}
          groupings={this.props.groupings}
          groupSort={this.props.groupSort}
          groupLimit={this.props.groupLimit}
          schema={this.props.schema}
        />
        <ResultsDisplay
          filtered={filtered}
          filteredLength={filtered.length}
          groupings={this.props.groupings}
          resultFields={this.props.resultFields}
          schema={this.props.schema}
          actionCreator={this.props.actionCreator}
          groupReducer={this.props.groupReducer}
          analyse={this.props.analyse}
          groupSort={this.props.groupSort}
          groupLimit={this.props.groupLimit}
          combineRemainder={this.props.combineRemainder}
        />
      </div>
    )
  },
})

module.exports = Query
