const React = require("react")

const Upload = React.createClass({
  displayName: "Upload",

  propTypes: {
    onAction: React.PropTypes.func.isRequired,
    errorDate: React.PropTypes.string,
  },

  onFileUploadStart: function(e) {
    const reader = new FileReader()
    reader.onload = this.onFileUploadEnd
    reader.readAsText(e.target.files[0])
  },

  onFileUploadEnd: function(e) {
    this.props.onAction(e.target.result)
  },

  render: function() {
    return (
      <div>
        <p><input type="file" key={this.props.errorDate} onChange={this.onFileUploadStart} /></p>
      </div>
    )
  },
})

module.exports = Upload
