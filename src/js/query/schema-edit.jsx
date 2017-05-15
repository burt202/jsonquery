const React = require("react")
const R = require("ramda")

const validator = require("../services/validator")

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
      inputKey: null,
    }
  },

  showError: function(message) {
    this.setState({"inputKey": Date.now()}) // to clear the input, resetting key of components forces re-render
    alert(message)
  },

  onFileUploadStart: function(e) {
    const reader = new FileReader()
    reader.onload = this.onFileUploadEnd
    reader.readAsText(e.target.files[0])
  },

  onFileUploadEnd: function(e) {
    const json = e.target.result

    if (!validator.isValidJSON(json)) {
      this.showError("Schema must be valid JSON")
      return
    }

    const parsed = JSON.parse(json)

    if (!validator.isObject(parsed)) {
      this.showError("Schema must be an object")
      return
    }

    this.props.onSave(parsed)
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
        <p><label>Upload: </label><input type="file" key={this.state.inputKey} onChange={this.onFileUploadStart} /></p>
        <ul className="side-options right">
          <li><a className="site-link" onClick={this.props.onCancel}>Cancel</a></li>
          <li><a className="site-link" onClick={this.onSave}>Save</a></li>
        </ul>
      </div>
    )
  },
})

module.exports = SchemaEdit
