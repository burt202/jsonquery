const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")
const classNames = require("classnames")

const validator = require("../../services/validator")

const Rows = require("./rows")
const Upload = require("../home/upload")
const Paste = require("../home/paste")

const SchemaEdit = createReactClass({
  displayName: "SchemaEdit",

  propTypes: {
    schema: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      selectedTab: "rows",
      errorDate: null,
    }
  },

  showError(message) {
    this.setState({"errorDate": Date.now()})
    alert(message)
  },

  selectTab(tab) {
    this.setState({
      selectedTab: tab,
    })
  },

  onAction(schema) {
    if (typeof schema === "string") {
      if (!validator.isValidJSON(schema)) {
        this.showError("Not valid JSON!")
        return
      }

      schema = JSON.parse(schema)
    }

    if (window.confirm("Are you sure? This will reset all filters")) {
      this.props.onSave(schema)
    }
  },

  getRowsComponent() {
    if (this.state.selectedTab !== "rows") return null
    return <Rows onAction={this.onAction} schema={this.props.schema} />
  },

  getPasteComponent() {
    if (this.state.selectedTab !== "paste") return null
    return <Paste onAction={this.onAction} data={this.props.schema} />
  },

  getUploadComponent() {
    if (this.state.selectedTab !== "upload") return null
    return <Upload onAction={this.onAction} errorDate={this.state.errorDate} />
  },

  render() {
    const rowsActive = classNames({active: this.state.selectedTab === "rows"})
    const pasteActive = classNames({active: this.state.selectedTab === "paste"})
    const uploadActive = classNames({active: this.state.selectedTab === "upload"})

    return (
      <div className="schema-edit-cont">
        <h3>Edit Schema</h3>
        <p><a className="site-link" onClick={this.props.onCancel}>Back</a></p>
        <p>Override the automatically generated schema:</p>
        <br />
        <ul className="side-options">
          <li className={rowsActive}><a className="site-link" onClick={this.selectTab.bind(this, "rows")}>By Rows</a></li>
          <li className={pasteActive}><a className="site-link" onClick={this.selectTab.bind(this, "paste")}>By Pasting</a></li>
          <li className={uploadActive}><a className="site-link" onClick={this.selectTab.bind(this, "upload")}>By Upload</a></li>
        </ul>
        {this.getRowsComponent()}
        {this.getPasteComponent()}
        {this.getUploadComponent()}
      </div>
    )
  },
})

module.exports = SchemaEdit
