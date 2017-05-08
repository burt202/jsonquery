const React = require("react")

const testSchema = {
  Title: "string",
  Artist: "string",
  Album: "string",
  Track: "int",
  Year: "int",
  Length: "int",
  Size: "string",
  Genre: "string",
}

const testData = require("../../test-data.json")

const validator = require("../helpers/validator")

const Home = React.createClass({
  displayName: "Home",

  propTypes: {
    actionCreator: React.PropTypes.object.isRequired,
  },

  getInitialState: function() {
    return {
      schemaInputKey: null,
      dataInputKey: null,
    }
  },

  updateState: function(key, val) {
    const newState = {}
    newState[key] = val
    this.setState(newState)
  },

  showError: function(name, message) {
    this.updateState(name + "InputKey", Date.now()) // to clear the input, resetting key of components forces re-render
    alert(message)
  },

  onFileUploadStart: function(name, e) {
    const reader = new FileReader()
    reader.onload = this.onFileUploadEnd.bind(this, name)
    reader.readAsText(e.target.files[0])
  },

  onFileUploadEnd: function(name, e) {
    const json = e.target.result

    if (!validator.isValidJSON(json)) {
      this.showError(name, "Not valid JSON!")
      return
    }

    const parsed = JSON.parse(json)
    const fn = (name === "schema") ? validator.isObject : validator.isArray

    if (!fn(parsed)) {
      this.showError(name, "The schema must be an object and data must be an array!")
      return
    }

    this.props.actionCreator.saveJson(name, JSON.parse(json))
  },

  showDemo: function() {
    window.scrollTo(0, 0)

    this.props.actionCreator.saveJson("data", testData)
    this.props.actionCreator.saveJson("schema", testSchema)
  },

  render: function() {
    return (
      <div className="home-cont">
        <p>Online JSON Querying Tool. Query your JSON with ease.</p>
        <p>Takes a JSON array, with a schema, and allows you to add multiple filters and a grouping to enable you to find results you want. Use the inputs below to supply your files. We do not do anything with your data!</p>
        <p><label>Schema:</label><input type="file" key={this.state.schemaInputKey} onChange={this.onFileUploadStart.bind(this, "schema")} /></p>
        <p><label>JSON:</label><input type="file" key={this.state.dataInputKey} onChange={this.onFileUploadStart.bind(this, "data")} /></p>

        <h3>Example</h3>
        <p>The schema should be a simple JSON object describing the fields you want to query on, matched with their type. This is then used to build up the dynamic filters on the next screen.</p>
        <p>Currently supported types are <i>string</i>, <i>int</i>, <i>bool</i>, <i>date</i> and <i>array</i>.</p>
        <pre>{JSON.stringify(testSchema, null, 2)}</pre>
        <p>...and the data should be a flat JSON array. That's it! <a className="site-link" onClick={this.showDemo}>See it in action</a></p>
        <pre>{JSON.stringify(testData, null, 2)}</pre>
      </div>
    )
  },
})

module.exports = Home
