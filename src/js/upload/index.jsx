const React = require("react")

const testSchema = {
  color: "string",
  automatic: "bool",
  noOfDoors: "int",
}

const testData = [
  {model: "Astra", color: "grey", automatic: false, noOfDoors: 3},
  {model: "Golf", color: "grey", automatic: false, noOfDoors: 5},
  {model: "Focus", color: "grey", automatic: false, noOfDoors: 3},
  {model: "Focus", color: "blue", automatic: true, noOfDoors: 5},
  {model: "Leon", color: "green", automatic: true, noOfDoors: 4},
  {model: "Astra", color: "red", automatic: false, noOfDoors: 3},
]

function isValidJSON(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }

  return true
}

const Upload = React.createClass({
  displayName: "Upload",

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

  onFileUploadStart: function(name, e) {
    const reader = new FileReader()
    reader.onload = this.onFileUploadEnd.bind(this, name)
    reader.readAsText(e.target.files[0])
  },

  onFileUploadEnd: function(name, e) {
    const json = e.target.result

    if (isValidJSON(json)) {
      this.props.actionCreator.saveJson(name, JSON.parse(json))
    } else {
      this.updateState(name + "InputKey", Date.now()) // to clear the input, resetting key of components forces re-render
      alert("Not valid JSON!")
    }
  },

  showDemo: function() {
    this.props.actionCreator.saveJson("data", testData)
    this.props.actionCreator.saveJson("schema", testSchema)
  },

  render: function() {
    return (
      <div className="upload-cont">
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

module.exports = Upload
