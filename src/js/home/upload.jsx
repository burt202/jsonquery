const React = require("react")
const PropTypes = require("prop-types")

const Inset = require("../components/inset")
const SpaceAfter = require("../components/space-after")

const {default: RaisedButton} = require("material-ui/RaisedButton")
const {default: UploadIcon} = require("material-ui/svg-icons/file/file-upload")

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

  triggerUpload() {
    this.input.click()
  },

  render() {
    const style = {
      borderColor: this.state.isDragActive ? "#000" : "#AAA",
    }

    return (
      <Inset>
        <SpaceAfter>
          <RaisedButton
            label="Upload"
            labelPosition="before"
            secondary
            icon={<UploadIcon/>}
            onTouchTap = {this.triggerUpload}/>
          <input
            style={{display: "none"}}
            ref={(e) => this.input = e}
            type="file"
            key={this.props.errorDate}
            onChange={this.onFileUploadStart}
          />
        </SpaceAfter>
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
      </Inset>
    )
  },
})

module.exports = Upload
