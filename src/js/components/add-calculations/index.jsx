const React = require("react")
const useState = React.useState
const PropTypes = require("prop-types")

const schemaGenerator = require("../../services/schema-generator")
const formatDate = require("date-fns/format")
const differenceInDays = require("date-fns/difference_in_days")
const utils = require("../../utils")

const Code = require("../shared/code")

const R = require("ramda")

const calculationsWrapper = `// Helper functions available
// --------------------------
// - formatDate(date, format) see https://date-fns.org/docs/format
// - differenceInDays(date, date)
// - round(decimals, number)

function addCalculations(fns, item) {
  return {}
}`

const fns = {formatDate, differenceInDays, round: utils.round}

function AddCalculations(props) {
  const [state, setState] = useState({
    calculationsString: props.calculationsString || calculationsWrapper,
    errors: "",
  })

  const onSave = () => {
    if (!state.calculationsString.length) {
      props.onSave(props.schema, props.data, calculationsWrapper, [])
      return
    }

    let calculationFn

    try {
      calculationFn = eval(`(${state.calculationsString})`)
      calculationFn(fns, props.data[0])
    } catch (e) {
      setState({
        ...state,
        errors: e.stack,
      })
      return
    }

    const schemaForCalculations = schemaGenerator.generate(calculationFn(fns, props.data[0]))
    const schema = R.merge(R.omit(props.calculatedFields, props.schema), schemaForCalculations)

    const data = R.map(row => {
      const calculations = calculationFn(fns, row)
      return R.merge(R.omit(props.calculatedFields, row), calculations)
    }, props.data)

    props.onSave(schema, data, state.calculationsString, R.keys(schemaForCalculations))
  }

  const onChange = e => {
    setState({
      calculationsString: e.target.value,
      errors: "",
    })
  }

  const getErrorDisplay = () => {
    if (!state.errors.length) return null

    return <Code language="json">{state.errors}</Code>
  }

  return (
    <div className="add-calculations-cont">
      <h3>Add Calculations</h3>
      <p>
        <a className="site-link" onClick={props.onCancel}>
          Back
        </a>
      </p>
      <textarea className="calculations" value={state.calculationsString} onChange={onChange} />
      {getErrorDisplay()}
      <h4>Sample Data Item</h4>
      <Code language="json">{JSON.stringify(props.data[0], null, 2)}</Code>
      <button onClick={onSave}>Save</button>
    </div>
  )
}

AddCalculations.propTypes = {
  schema: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  calculationsString: PropTypes.string,
  calculatedFields: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

module.exports = AddCalculations
