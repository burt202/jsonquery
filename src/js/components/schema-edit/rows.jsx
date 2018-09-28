const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")
const R = require("ramda")

const SchemaEditRow = require("./row")

const SchemaEditRows = createReactClass({
  displayName: "SchemaEditRows",

  propTypes: {
    schema: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      schema: this.props.schema,
    }
  },

  onChange(field, type) {
    this.setState({
      schema: R.assoc(field, type, this.state.schema),
    })
  },

  onSave() {
    this.props.onSave(this.state.schema)
  },

  getSchemaRows() {
    return R.toPairs(this.state.schema).map(function(pair) {
      return (
        <SchemaEditRow
          key={pair[0]}
          field={pair[0]}
          type={pair[1]}
          onChange={this.onChange}
        />
      )
    }.bind(this))
  },

  render() {
    return (
      <div>
        <div className="rows">
          <table className="table">
            <tbody>
              {this.getSchemaRows()}
            </tbody>
          </table>
        </div>
        <button onClick={this.onSave}>Save</button>
      </div>
    )
  },
})

module.exports = SchemaEditRows
