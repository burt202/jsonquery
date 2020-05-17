const React = require("react")
const useState = React.useState
const PropTypes = require("prop-types")
const classNames = require("classnames")

const validator = require("../../services/validator")

const Rows = require("./rows")
const Upload = require("../home/upload")
const Paste = require("../home/paste")

function SchemaEdit(props) {
  const [state, setState] = useState({
    selectedTab: "rows",
    errorDate: null,
  })

  const showError = message => {
    setState({...state, errorDate: Date.now()})
    alert(message)
  }

  const selectTab = tab => {
    setState({
      ...state,
      selectedTab: tab,
    })
  }

  const onAction = schema => {
    if (typeof schema === "string") {
      if (!validator.isValidJSON(schema)) {
        showError("Not valid JSON!")
        return
      }

      schema = JSON.parse(schema)
    }

    if (window.confirm("Are you sure? This will reset all filters")) {
      props.onSave(schema)
    }
  }

  const getRowsComponent = () => {
    if (state.selectedTab !== "rows") return null
    return <Rows onAction={onAction} schema={props.schema} />
  }

  const getPasteComponent = () => {
    if (state.selectedTab !== "paste") return null
    return <Paste onAction={onAction} data={props.schema} />
  }

  const getUploadComponent = () => {
    if (state.selectedTab !== "upload") return null
    return <Upload onAction={onAction} errorDate={state.errorDate} />
  }

  const rowsActive = classNames({active: state.selectedTab === "rows"})
  const pasteActive = classNames({active: state.selectedTab === "paste"})
  const uploadActive = classNames({active: state.selectedTab === "upload"})

  return (
    <div className="schema-edit-cont">
      <h3>Edit Schema</h3>
      <p>
        <a className="site-link" onClick={props.onCancel}>
          Back
        </a>
      </p>
      <p>Override the automatically generated schema:</p>
      <br />
      <ul className="side-options">
        <li className={rowsActive}>
          <a className="site-link" onClick={() => selectTab("rows")}>
            By Rows
          </a>
        </li>
        <li className={pasteActive}>
          <a className="site-link" onClick={() => selectTab("paste")}>
            By Pasting
          </a>
        </li>
        <li className={uploadActive}>
          <a className="site-link" onClick={() => selectTab("upload")}>
            By Upload
          </a>
        </li>
      </ul>
      {getRowsComponent()}
      {getPasteComponent()}
      {getUploadComponent()}
    </div>
  )
}

SchemaEdit.propTypes = {
  schema: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

module.exports = SchemaEdit
