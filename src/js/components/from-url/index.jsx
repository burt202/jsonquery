const React = require("react")
const useState = React.useState
const PropTypes = require("prop-types")

const {Typography} = require("antd")
const {Text} = Typography

const validator = require("../../services/validator")
const schemaGenerator = require("../../services/schema-generator")

const Code = require("../shared/code")

function fetchData(url, withCredentials) {
  const opts = {method: "get"}
  if (withCredentials) opts.credentials = "include"

  return fetch(url, opts).then(response => {
    if (!response.ok) {
      throw Error(response.statusText)
    }

    return response.json()
  })
}

function FromUrl(props) {
  const [state, setState] = useState({
    errors: null,
  })

  const onFetchComplete = data => {
    const errors = []

    if (!data) {
      errors.push("Empty reponse. Make sure CORS is setup properly on the data domain")
    }

    if (data && !validator.isArray(data)) {
      errors.push("Data must be an array")
    }

    if (data && !data.length) {
      errors.push("Data must have at least 1 item")
    }

    let schema = null

    if (props.params.schema) {
      const fromUrl = decodeURIComponent(props.params.schema)

      if (!validator.isValidJSON(fromUrl)) {
        errors.push("Schema must be valid JSON")
      }

      if (!validator.isObject(fromUrl)) {
        errors.push("Schema must be an object")
      }

      schema = JSON.parse(fromUrl)
    }

    if (errors.length) {
      setState({errors})
      return
    }

    if (!schema) schema = schemaGenerator.generate(data[0])

    props.actionCreator.saveJson("data", data)
    props.actionCreator.saveJson("schema", schema)
  }

  const onFetchError = err => {
    setState({errors: [err.message]})
  }

  fetchData(props.params.dataUrl, props.params.withCredentials)
    .then(onFetchComplete)
    .catch(onFetchError)

  if (state.errors) {
    return (
      <div style={{marginTop: 16}}>
        <Code language="json">{JSON.stringify(state.errors, null, 2)}</Code>
      </div>
    )
  }

  return (
    <div className="from-url-cont">
      <div>
        <img src="./gears.svg" />
        <div style={{marginTop: 16}}>
          <Text>Working, please wait...</Text>
        </div>
      </div>
    </div>
  )
}

FromUrl.propTypes = {
  actionCreator: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
}

module.exports = FromUrl
