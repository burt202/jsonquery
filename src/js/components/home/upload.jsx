const React = require("react")
const useState = React.useState
const PropTypes = require("prop-types")

function Upload(props) {
  const [state, setState] = useState({
    isDragActive: false,
  })

  const onDragOver = e => {
    e.preventDefault()

    setState({
      isDragActive: true,
    })
  }

  const onDragEnter = e => {
    e.preventDefault()
  }

  const onDragLeave = () => {
    setState({
      isDragActive: false,
    })
  }

  const onDrop = e => {
    e.preventDefault()

    setState({
      isDragActive: false,
    })

    const reader = new FileReader()
    reader.onload = onFileUploadEnd
    reader.readAsText(e.dataTransfer.files[0])
  }

  const onFileUploadStart = e => {
    const reader = new FileReader()
    reader.onload = onFileUploadEnd
    reader.readAsText(e.target.files[0])
  }

  const onFileUploadEnd = e => {
    props.onAction(e.target.result)
  }

  const style = {
    borderColor: state.isDragActive ? "#000" : "#AAA",
  }

  return (
    <div>
      <p>
        <input type="file" key={props.errorDate} onChange={onFileUploadStart} />
      </p>
      <div
        style={style}
        className="drag-drop-area"
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDrop={onDrop}
      >
        <h3>Drop file here</h3>
      </div>
    </div>
  )
}

Upload.propTypes = {
  onAction: PropTypes.func.isRequired,
  errorDate: PropTypes.number,
}

module.exports = Upload
