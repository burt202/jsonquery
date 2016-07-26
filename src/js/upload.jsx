var React = require("react");

var testSchema = {
  color: "string",
  automatic: "bool",
  noOfDoors: "int"
};

var testData = [
  {model: "Astra", color: "grey", automatic: false, noOfDoors: 3},
  {model: "Golf", color: "grey", automatic: false, noOfDoors: 5},
  {model: "Focus", color: "grey", automatic: false, noOfDoors: 3},
  {model: "Focus", color: "blue", automatic: true, noOfDoors: 5},
  {model: "Leon", color: "green", automatic: true, noOfDoors: 4},
  {model: "Astra", color: "red", automatic: false, noOfDoors: 3}
]

function isValidJSON (str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
}

var Upload = React.createClass({
  displayName: "Upload",

  propTypes: {
    actionCreator: React.PropTypes.object.isRequired
  },

  onFileUploadStart: function (name, e) {
    var reader = new FileReader();
    reader.onload = this.onFileUploadEnd.bind(this, name);
    reader.readAsText(e.target.files[0]);
  },

  onFileUploadEnd: function (name, e) {
    var json = e.target.result;

    if (isValidJSON(json)) {
      this.props.actionCreator.saveJson(name, JSON.parse(json));
    } else {
      alert("Not valid JSON!");
    }
  },

  showDemo: function () {
    this.props.actionCreator.saveJson("data", testData);
    this.props.actionCreator.saveJson("schema", testSchema);
  },

  render: function () {
    return (
      <div>
        <p>Query your JSON with ease.</p>
        <p>Takes a JSON array, with a schema, and allows you to add multiple filters and a grouping to enable you to find results you want. Use the inputs below to supply your files. We do not do anything with your data!</p>
        Schema: <input type="file" onChange={this.onFileUploadStart.bind(this, "schema")} />
        JSON: <input type="file" onChange={this.onFileUploadStart.bind(this, "data")} />

        <h3>Example</h3>
        <p>The schema should be a simple JSON object describing the fields you want to query on, matched with their type. This is then used to build up the dynamic filters on the next screen.</p>
        <p>Currently supported types are <i>string</i>, <i>int</i> and <i>bool</i>.</p>
        <pre>{JSON.stringify(testSchema, null, 2)}</pre>
        <p>...and the data should be a flat JSON array. That's it! <a className="site-link" onClick={this.showDemo}>See it in action</a></p>
        <pre>{JSON.stringify(testData, null, 2)}</pre>
      </div>
    );
  }
});

module.exports = Upload;
