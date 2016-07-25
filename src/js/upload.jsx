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

var Upload = React.createClass({
  displayName: "Upload",

  propTypes: {
    actionCreator: React.PropTypes.object.isRequired
  },

  onFileUpload: function (name, evt) {
    var file = evt.target.files[0];
    var reader = new FileReader();

    reader.onload = function () {
      var json = JSON.parse(reader.result);
      this.props.actionCreator.saveJson(name, json);
    }.bind(this);

    reader.readAsText(file);
  },

  showDemo: function () {
    this.props.actionCreator.saveJson("data", testData);
    this.props.actionCreator.saveJson("schema", testSchema);
  },

  render: function () {
    return (
      <div className="upload-cont">
        <p>Query your JSON with ease.</p>
        <p>Takes a JSON array, with a schema, and allows multiple filters and a grouping to enable you to find results you want. See below for an example.</p>
        Schema: <input type="file" onChange={this.onFileUpload.bind(this, "schema")} />
        JSON: <input type="file" onChange={this.onFileUpload.bind(this, "data")} />

        <h3>Example</h3>
        <p><a className="site-link" onClick={this.showDemo}>See it in action</a></p>
        <p>The schema should be a simple JSON object describing the fields you want to query on, matched with their type. This is then used to build up the dynamic filters on the next screen. Currently supported types are 'string', 'int' and 'bool'.</p>
        <pre>{JSON.stringify(testSchema, null, 2)}</pre>
        <p>The data should be a flat JSON array</p>
        <pre>{JSON.stringify(testData, null, 2)}</pre>
      </div>
    );
  }
});

module.exports = Upload;
