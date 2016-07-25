var React = require("react");

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

  render: function () {
    return (
      <div>
        Schema: <input type="file" onChange={this.onFileUpload.bind(this, "schema")} />
        Data: <input type="file" onChange={this.onFileUpload.bind(this, "data")} />
      </div>
    );
  }
});

module.exports = Upload;
