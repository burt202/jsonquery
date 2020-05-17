const React = require("react")
const useState = React.useState
const PropTypes = require("prop-types")
const classNames = require("classnames")

const validator = require("../../services/validator")
const schemaGenerator = require("../../services/schema-generator")

const Paste = require("./paste")
const Upload = require("./upload")
const Url = require("./url")

const testData = require("../../../test-data.json")

function Home(props) {
  const [state, setState] = useState({
    selectedTab: "paste",
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

  const onAction = json => {
    if (!validator.isValidJSON(json)) {
      showError("Not valid JSON!")
      return
    }

    json = JSON.parse(json)

    if (!validator.isArray(json)) {
      showError("Data must be an array")
      return
    }

    if (!json.length) {
      showError("Data must have at least 1 item")
      return
    }

    props.actionCreator.saveJson("data", json)
    props.actionCreator.saveJson("schema", schemaGenerator.generate(json[0]))
  }

  const getPasteComponent = () => {
    if (state.selectedTab !== "paste") return null
    return <Paste onAction={onAction} data={testData} />
  }

  const getUploadComponent = () => {
    if (state.selectedTab !== "upload") return null
    return <Upload onAction={onAction} errorDate={state.errorDate} />
  }

  const getUrlComponent = () => {
    if (state.selectedTab !== "url") return null
    return <Url />
  }

  const pasteActive = classNames({active: state.selectedTab === "paste"})
  const uploadActive = classNames({active: state.selectedTab === "upload"})
  const urlActive = classNames({active: state.selectedTab === "url"})

  return (
    <div className="home-cont">
      <p>Online JSON Querying Tool. Query your JSON with ease.</p>
      <p>
        Takes a JSON array and allows you to add multiple filters, groupings and sorting to
        manipulate the data in many ways. Use the inputs below to supply your data. We do not do
        anything with your data!
      </p>
      <br />
      <ul className="side-options">
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
        <li className={urlActive}>
          <a className="site-link" onClick={() => selectTab("url")}>
            By Url
          </a>
        </li>
      </ul>
      {getPasteComponent()}
      {getUploadComponent()}
      {getUrlComponent()}
    </div>
  )
}

Home.propTypes = {
  actionCreator: PropTypes.object.isRequired,
}

module.exports = Home
