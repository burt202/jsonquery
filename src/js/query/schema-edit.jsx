const React = require("react")
const PropTypes = require("prop-types")
const R = require("ramda")

const validator = require("../services/validator")
const Layout = require("../components/layout")

const SpaceAfter = require("../components/space-after")
const Inset = require("../components/inset")

const {default: UploadIcon} = require("material-ui/svg-icons/file/file-upload")
const {default: RaisedButton} = require("material-ui/RaisedButton")
const {default: FlatButton} = require("material-ui/FlatButton")
const {default: Divider} = require("material-ui/Divider")

const SchemaEditRow = require("./schema-edit-row")
const Code = require("../components/code")

const SchemaEdit = React.createClass({
  displayName: "SchemaEdit",

  propTypes: {
    schema: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      schema: this.props.schema,
      inputKey: null,
    }
  },

  showError(message) {
    this.setState({"inputKey": Date.now()}) // to clear the input, resetting key of components forces re-render
    alert(message)
  },

  onFileUploadStart(e) {
    const reader = new FileReader()
    reader.onload = this.onFileUploadEnd
    reader.readAsText(e.target.files[0])
  },

  onFileUploadEnd(e) {
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

  triggerUpload() {
    this.upload.click()
  },

  render() {
    return (<Layout
      left={<div>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <FlatButton secondary label="Cancel" onTouchTap={this.props.onCancel}/>
          <FlatButton secondary label="Save" onTouchTap={this.onSave}/>
        </div>
        <Divider/>
        <Inset vertical={false}>
          {this.getSchemaRows()}
        </Inset>
      </div>}

      right={<Inset>
        <SpaceAfter>
          <RaisedButton
            label="Upload"
            labelPosition="before"
            secondary
            icon={<UploadIcon/>}
            onTouchTap = {this.triggerUpload}/>
          <input style={{display: "none"}} ref={(r) => this.upload = r} type="file" key={this.state.inputKey} onChange={this.onFileUploadStart} />
        </SpaceAfter>
        <Code language="json">
          {JSON.stringify(this.state.schema, null, 2)}
        </Code>
      </Inset>}
    />)
  },
})

module.exports = SchemaEdit
