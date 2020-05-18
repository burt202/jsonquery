const React = require("react")
const useState = React.useState
const PropTypes = require("prop-types")

const R = require("ramda")

const dataProcessor = require("../../services/data-processor")

const SchemaEdit = require("../schema-edit")
const AddCalculations = require("../add-calculations")

const Filters = require("./filters")
const Controls = require("./controls")
const IncludeFields = require("./include-fields")
const Summary = require("./summary")
const ResultsDisplay = require("./results-display")

function Query(props) {
  const [state, setState] = useState({
    selectedPage: "query",
  })

  const onReset = () => {
    props.actionCreator.reset()
  }

  const onCancel = () => {
    setState({selectedPage: "query"})
  }

  const onSchemaEditSave = schema => {
    setState({selectedPage: "query"})
    props.actionCreator.saveJson("schema", schema)
  }

  const onAddCalculationSave = (schema, data, calculationsString, calculatedFields) => {
    setState({selectedPage: "query"})
    props.actionCreator.saveJson("data", data)
    props.actionCreator.saveJson("schema", schema)
    props.actionCreator.saveCalculatedFields(calculatedFields)
    props.actionCreator.saveCalculationsString(calculationsString)
  }

  const getEditSchemaComponent = () => {
    return <SchemaEdit schema={props.schema} onSave={onSchemaEditSave} onCancel={onCancel} />
  }

  const getAddCalculationComponent = () => {
    return (
      <AddCalculations
        data={props.data}
        schema={props.schema}
        calculatedFields={props.calculatedFields}
        calculationsString={props.calculationsString}
        onSave={onAddCalculationSave}
        onCancel={onCancel}
      />
    )
  }

  const filterResults = data => {
    return dataProcessor.filter(data, props.schema, props.filters)
  }

  const sortResults = data => {
    return props.sorters.length ? dataProcessor.sort(props.sorters, data) : data
  }

  const limitResults = data => {
    return props.limit ? dataProcessor.limit(props.limit, data) : data
  }

  const pickIncludedFields = data => {
    return R.map(R.pickAll(R.sortBy(R.identity, props.resultFields)))(data)
  }

  const filterSortAndLimit = data => {
    return R.pipe(filterResults, sortResults, limitResults, pickIncludedFields)(data)
  }

  if (state.selectedPage === "editSchema") return getEditSchemaComponent()
  if (state.selectedPage === "addCalc") return getAddCalculationComponent()

  const filtered = filterSortAndLimit(props.data)

  return (
    <div className="query-cont">
      <ul className="side-options right">
        <li>
          <a className="site-link" onClick={() => setState({selectedPage: "addCalc"})}>
            Add Calculations
          </a>
        </li>
        <li>
          <a className="site-link" onClick={() => setState({selectedPage: "editSchema"})}>
            Edit Schema
          </a>
        </li>
        <li>
          <a className="site-link" onClick={onReset}>
            Reset
          </a>
        </li>
      </ul>
      <Filters actionCreator={props.actionCreator} filters={props.filters} schema={props.schema} />
      <Controls
        actionCreator={props.actionCreator}
        schema={props.schema}
        groupings={props.groupings}
        sorters={props.sorters}
        groupReducer={props.groupReducer}
        groupSort={props.groupSort}
        groupLimit={props.groupLimit}
        limit={props.limit}
        analyse={props.analyse}
        combineRemainder={props.combineRemainder}
      />
      <IncludeFields
        groupings={props.groupings}
        resultFields={props.resultFields}
        schema={props.schema}
        actionCreator={props.actionCreator}
        groupReducer={props.groupReducer}
        analyse={props.analyse}
      />
      <Summary
        rawDataLength={props.data.length}
        filtered={filtered}
        groupings={props.groupings}
        groupSort={props.groupSort}
        groupLimit={props.groupLimit}
        schema={props.schema}
      />
      <ResultsDisplay
        filtered={filtered}
        filteredLength={filtered.length}
        groupings={props.groupings}
        resultFields={props.resultFields}
        schema={props.schema}
        actionCreator={props.actionCreator}
        groupReducer={props.groupReducer}
        analyse={props.analyse}
        groupSort={props.groupSort}
        groupLimit={props.groupLimit}
        combineRemainder={props.combineRemainder}
      />
    </div>
  )
}

Query.propTypes = {
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
}

module.exports = Query
