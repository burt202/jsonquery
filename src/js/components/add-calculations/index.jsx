const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")

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

const AddCalculations = createReactClass({
  displayName: "AddCalculations",

  propTypes: {
    schema: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    calculationsString: PropTypes.string,
    calculatedFields: PropTypes.array.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      calculationsString: this.props.calculationsString || calculationsWrapper,
      errors: "",
    }
  },

  onSave() {
    if (!this.state.calculationsString.length) {
      this.props.onSave(this.props.schema, this.props.data, calculationsWrapper, [])
      return
    }

    let calculationFn

    try {
      calculationFn = eval(`(${this.state.calculationsString})`)
      calculationFn(fns, this.props.data[0])
    } catch (e) {
      this.setState({
        errors: e.stack,
      })
      return
    }

    const schemaForCalculations = schemaGenerator.generate(calculationFn(fns, this.props.data[0]))
    const schema = R.merge(
      R.omit(this.props.calculatedFields, this.props.schema),
      schemaForCalculations,
    )

    const data = R.map(
      function(row) {
        const calculations = calculationFn(fns, row)
        return R.merge(R.omit(this.props.calculatedFields, row), calculations)
      }.bind(this),
      this.props.data,
    )

    this.props.onSave(schema, data, this.state.calculationsString, R.keys(schemaForCalculations))
  },

  onChange(e) {
    this.setState({
      calculationsString: e.target.value,
      errors: "",
    })
  },

  getErrorDisplay() {
    if (!this.state.errors.length) return null

    return <Code language="json">{this.state.errors}</Code>
  },

  render() {
    return (
      <div className="add-calculations-cont">
        <h3>Add Calculations</h3>
        <p>
          <a className="site-link" onClick={this.props.onCancel}>
            Back
          </a>
        </p>
        <textarea
          className="calculations"
          value={this.state.calculationsString}
          onChange={this.onChange}
        />
        {this.getErrorDisplay()}
        <h4>Sample Data Item</h4>
        <Code language="json">{JSON.stringify(this.props.data[0], null, 2)}</Code>
        <button onClick={this.onSave}>Save</button>
      </div>
    )
  },
})

module.exports = AddCalculations
