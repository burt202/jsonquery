const React = require("react")
const PropTypes = require("prop-types")

const Upload = React.createClass({
  displayName: "Upload",

  propTypes: {
    onAction: PropTypes.func.isRequired,
    errorDate: PropTypes.number,
  },

  getInitialState() {
    return {
      isDragActive: false,
    }
  },

  onDragOver(e) {
    e.preventDefault()

    this.setState({
      isDragActive: true,
    })
  },

  onDragEnter(e) {
    e.preventDefault()
  },


  onDragLeave() {
    this.setState({
      isDragActive: false,
    })
  },

  onDrop(e) {
    e.preventDefault()

    this.setState({
      isDragActive: false,
    })

    const reader = new FileReader()
    reader.onload = this.onFileUploadEnd
    reader.readAsText(e.dataTransfer.files[0])
  },

  onFileUploadStart(e) {
    const reader = new FileReader()
    reader.onload = this.onFileUploadEnd
    reader.readAsText(e.target.files[0])
  },

  onFileUploadEnd(e) {
    this.props.onAction(e.target.result)
  },

  render() {
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
