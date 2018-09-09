const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")

const validator = require("../../services/validator")
const schemaGenerator = require("../../services/schema-generator")

const Code = require("../components/code")

function fetchData(url, withCredentials) {
  const opts = {method: "get"}
  if (withCredentials) opts.credentials = "include"

  return fetch(url, opts)
    .then(function(response) {
      if (!response.ok) {
        throw Error(response.statusText)
      }

      return response.json()
    })
}

const FromUrl = createReactClass({
  displayName: "FromUrl",

  propTypes: {
    actionCreator: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      errors: null,
    }
  },

  componentDidMount() {
    fetchData(
      this.props.params.dataUrl,
      Object.prototype.hasOwnProperty.call(this.props.params, "withCredentials")
    )
      .then(this.onFetchComplete)
      .catch(this.onFetchError)
  },

  onFetchComplete(data) {
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

    if (this.props.params.schema) {
      const fromUrl = decodeURIComponent(this.props.params.schema)

      if (!validator.isValidJSON(fromUrl)) {
        errors.push("Schema must be valid JSON")
      }

      if (!validator.isObject(fromUrl)) {
        errors.push("Schema must be an object")
      }

      schema = JSON.parse(fromUrl)
    }

    if (errors.length) {
      this.setState({errors})
      return
    }

    if (!schema) schema = schemaGenerator.generate(data[0])

    this.props.actionCreator.saveJson("data", data)
    this.props.actionCreator.saveJson("schema", schema)
  },

  onFetchError(err) {
    this.setState({errors: [err.message]})
  },

  render() {
    if (this.state.errors) {
      return (<div><br /><Code language="json">{JSON.stringify(this.state.errors, null, 2)}</Code></div>)
    }

    return (
      <div className="from-url-cont">
        <img src="./gears.svg" />
        <p>Working, please wait...</p>
      </div>
    )
  },
})

module.exports = FromUrl
