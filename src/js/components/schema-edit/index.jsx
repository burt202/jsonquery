const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")
const classNames = require("classnames")

const validator = require("../../services/validator")

const Rows = require("./rows")
const Upload = require("../home/upload")

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

    this.props.onSave(schema)
  },

  getRowsComponent() {
    if (this.state.selectedTab !== "rows") return null
    return <Rows schema={this.props.schema} onSave={this.onAction} />
  },

  getUploadComponent() {
    if (this.state.selectedTab !== "upload") return null
    return <Upload onAction={this.onAction} errorDate={this.state.errorDate} />
  },

  render() {
    const rowsActive = classNames({active: this.state.selectedTab === "rows"})
    const uploadActive = classNames({active: this.state.selectedTab === "upload"})

    return (
      <div className="schema-edit-cont">
        <h3>Edit Schema</h3>
        <p><a className="site-link" onClick={this.props.onCancel}>Back</a></p>
        <p>Override the automatically generated schema:</p>
        <br />
        <ul className="side-options">
          <li className={rowsActive}><a className="site-link" onClick={this.selectTab.bind(this, "rows")}>By Rows</a></li>
          <li className={uploadActive}><a className="site-link" onClick={this.selectTab.bind(this, "upload")}>By Upload</a></li>
        </ul>
        {this.getRowsComponent()}
        {this.getUploadComponent()}
      </div>
    )
  },
})

module.exports = SchemaEdit
