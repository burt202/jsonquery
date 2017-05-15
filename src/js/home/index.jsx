const React = require("react")
const classNames = require("classnames")

const validator = require("../services/validator")
const schemaGenerator = require("../services/schema-generator")

const Paste = require("./paste")
const Upload = require("./upload")

const Home = React.createClass({
  displayName: "Home",

  propTypes: {
    actionCreator: React.PropTypes.object.isRequired,
  },

  getInitialState: function() {
    return {
      selectedTab: "paste",
      errorDate: null,
    }
  },

  showError: function(message) {
    this.setState({"errorDate": Date.now()})
    alert(message)
  },

  selectTab: function(tab) {
    this.setState({
      selectedTab: tab,
    })
  },

  onAction: function(json) {
    if (!validator.isValidJSON(json)) {
      this.showError("Not valid JSON!")
      return
    }

    json = JSON.parse(json)

    if (!validator.isArray(json)) {
      this.showError("Data must be an array")
      return
    }

    if (!json.length) {
      this.showError("Data must have at least 1 item")
      return
    }

    this.props.actionCreator.saveJson("data", json)
    this.props.actionCreator.saveJson("schema", schemaGenerator.generate(json[0]))
  },

  getPasteInput: function() {
    if (this.state.selectedTab !== "paste") return null
    return <Paste onAction={this.onAction} />
  },

  getUploadInput: function() {
    if (this.state.selectedTab !== "upload") return null
    return <Upload onAction={this.onAction} errorDate={this.state.errorDate} />
  },

  render: function() {
    const pasteActive = classNames({active: this.state.selectedTab === "paste"})
    const uploadActive = classNames({active: this.state.selectedTab === "upload"})

    return (
      <div className="home-cont">
        <p>Online JSON Querying Tool. Query your JSON with ease.</p>
        <p>Takes a JSON array and allows you to add multiple filters, groupings and sorting to manipulate the data in many ways. Use the inputs below to supply your data. We do not do anything with your data!</p>
        <br />
        <ul className="side-options">
          <li className={pasteActive}><a className="site-link" onClick={this.selectTab.bind(this, "paste")}>By Pasting</a></li>
          <li className={uploadActive}><a className="site-link" onClick={this.selectTab.bind(this, "upload")}>By Upload</a></li>
        </ul>
        {this.getPasteInput()}
        {this.getUploadInput()}
      </div>
    )
  },
})

module.exports = Home
