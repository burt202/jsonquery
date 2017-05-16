const React = require("react")

const Upload = React.createClass({
  displayName: "Upload",

  propTypes: {
    onAction: React.PropTypes.func.isRequired,
    errorDate: React.PropTypes.number,
  },

  getInitialState: function() {
    return {
      isDragActive: false,
    }
  },

  onDragOver: function(e) {
    e.preventDefault()

    this.setState({
      isDragActive: true,
    })
  },

  onDragEnter: function(e) {
    e.preventDefault()
  },


  onDragLeave: function() {
    this.setState({
      isDragActive: false,
    })
  },

  onDrop: function(e) {
    e.preventDefault()

    this.setState({
      isDragActive: false,
    })

    const reader = new FileReader()
    reader.onload = this.onFileUploadEnd
    reader.readAsText(e.dataTransfer.files[0])
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
    const style = {
      borderColor: this.state.isDragActive ? "#000" : "#AAA",
    }

    return (
      <div>
        <p><input type="file" key={this.props.errorDate} onChange={this.onFileUploadStart} /></p>
        <div
          style={style}
          className="drag-drop-area"
          onDragLeave={this.onDragLeave}
          onDragOver={this.onDragOver}
          onDragEnter={this.onDragEnter}
          onDrop={this.onDrop}
        >
          <h3>Drop file here</h3>
        </div>
      </div>
    )
  },
})

module.exports = Upload
