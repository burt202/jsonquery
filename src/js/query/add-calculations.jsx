const React = require("react")
const PropTypes = require("prop-types")

const schemaGenerator = require("../services/schema-generator")
const formatDate = require("date-fns/format")
const utils = require("../utils")

const Code = require("../components/code")

const R = require("ramda")

const calculationsWrapper = `// Helper functions available
// --------------------------
// - formatDate(date, format) see https://date-fns.org/docs/format
// - round(decimals, number)

function addCalculations(fns, item) {
  return {}
}`

const AddCalculations = React.createClass({
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
    }
  },

  onSave() {
    const fns = {formatDate, round: utils.round}

    let calculationFn

    try {
      calculationFn = eval(`(${this.state.calculationsString})`)
      calculationFn(fns, this.props.data[0])
    } catch (e) {
      alert("Calculations not valid")
      return
    }

    const schemaForCalculations = schemaGenerator.generate(calculationFn(fns, this.props.data[0]))
    const schema = R.merge(R.omit(this.props.calculatedFields, this.props.schema), schemaForCalculations)

    const data = R.map(function(row) {
      const calculations = calculationFn(fns, row)
      return R.merge(R.omit(this.props.calculatedFields, row), calculations)
    }.bind(this), this.props.data)

    this.props.onSave(schema, data, this.state.calculationsString, R.keys(schemaForCalculations))
  },

  onChange(e) {
    this.setState({
      calculationsString: e.target.value,
    })
  },

  render() {
    return (
      <div className="add-calculations-cont">
        <h3>Add Calculations</h3>
        <textarea className="calculations" value={this.state.calculationsString} onChange={this.onChange} />
        <h4>Sample Item</h4>
        <Code language="json">
          {JSON.stringify(this.props.data[0], null, 2)}
        </Code>
        <ul className="side-options right">
          <li><a className="site-link" onClick={this.props.onCancel}>Cancel</a></li>
          <li><a className="site-link" onClick={this.onSave}>Save</a></li>
        </ul>
      </div>
    )
  },
})

module.exports = AddCalculations
