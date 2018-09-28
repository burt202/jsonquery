const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")
const R = require("ramda")

const SchemaEditRow = require("./row")

const SchemaEditRows = createReactClass({
  displayName: "SchemaEditRows",

  propTypes: {
    schema: PropTypes.object.isRequired,
    onAction: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      schema: this.props.schema,
      fieldName: "",
    }
  },

  onChangeExisting(field, type) {
    this.setState({
      schema: R.assoc(field, type, this.state.schema),
    })
  },

  onRemoveExisting(field) {
    this.setState({
      schema: R.dissoc(field, this.state.schema),
    })
  },

  onSave() {
    this.props.onAction(this.state.schema)
  },

  getSchemaRows() {
    return R.toPairs(this.state.schema).map(function(pair) {
      return (
        <SchemaEditRow
          key={pair[0]}
          field={pair[0]}
          type={pair[1]}
          onChange={this.onChangeExisting}
          onRemove={this.onRemoveExisting}
        />
      )
    }.bind(this))
  },

  onInputChange(e) {
    this.setState({
      fieldName: e.target.value,
    })
  },

  onSelectChange(e) {
    this.setState({
      schema: R.assoc(this.state.fieldName, e.target.value, this.state.schema),
      fieldName: "",
    })
  },

  render() {
    return (
      <div>
        <div className="rows">
          <table className="table">
            <tbody>
              {this.getSchemaRows()}
              <tr>
                <td><input value={this.state.fieldName} placeholder="Add new field..." onChange={this.onInputChange} /></td>
                <td colSpan="2">
                  <select value="" disabled={!this.state.fieldName.length} onChange={this.onSelectChange}>
                    <option value=""></option>
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="bool">Bool</option>
                    <option value="date">Date</option>
                    <option value="time">Time</option>
                    <option value="array">Array</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button onClick={this.onSave}>Save</button>
      </div>
    )
  },
})

module.exports = SchemaEditRows
