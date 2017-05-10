const React = require("react")
const R = require("ramda")

const SchemaEditRow = require("./schema-edit-row")

const SchemaEdit = React.createClass({
  displayName: "SchemaEdit",

  propTypes: {
    schema: React.PropTypes.object.isRequired,
    onSave: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
  },

  getInitialState: function() {
    return {
      schema: this.props.schema,
    }
  },

  onChange: function(field, type) {
    this.setState({
      schema: R.assoc(field, type, this.state.schema),
    })
  },

  onSave: function() {
    this.props.onSave(this.state.schema)
  },

  getSchemaRows: function() {
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

  render: function() {
    return (
      <div className="schema-edit-cont">
        <h3>Edit Schema</h3>
        <div className="rows">
          <table className="table" style={{width: "60%"}}>
            <tbody>
              {this.getSchemaRows()}
            </tbody>
          </table>
          <pre>
            {JSON.stringify(this.state.schema, null, 2)}
          </pre>
        </div>
        <ul className="side-options">
          <li><a className="site-link" onClick={this.props.onCancel}>Cancel</a></li>
          <li><a className="site-link" onClick={this.onSave}>Save</a></li>
        </ul>
      </div>
    )
  },
})

module.exports = SchemaEdit
