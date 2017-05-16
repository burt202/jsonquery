const React = require("react")
const PropTypes = require("prop-types")

const validator = require("../services/validator")
const schemaGenerator = require("../services/schema-generator")

function fetchData(url) {
  return fetch(url, {method: "get"})
  .then(function(response) {
    if (!response.ok) {
      throw Error(response.statusText)
    }

    return response.json()
  })
}

const FromUrl = React.createClass({
  displayName: "FromUrl",

  propTypes: {
    actionCreator: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  },

  getInitialState: function() {
    return {
      errors: null,
    }
  },

  componentDidMount: function() {
    fetchData(this.props.params.dataUrl)
    .then(this.onFetchComplete)
    .catch(this.onFetchError)
  },

  onFetchComplete: function(data) {
    const errors = []

    if (!validator.isArray(data)) {
      errors.push("Data must be an array")
    }

    if (!data.length) {
      errors.push("Data must have at least 1 item")
    }

    var schema = null

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

    if (!schema) schema = schemaGenerator.generate(data[0])

    if (errors.length) {
      this.setState({errors: errors})
      return
    }

    this.props.actionCreator.saveJson("data", data)
    this.props.actionCreator.saveJson("schema", schema)
  },

  onFetchError: function(err) {
    this.setState({errors: [err.message]})
  },

  render: function() {
    if (this.state.errors) {
      return (<div><br /><pre>{JSON.stringify(this.state.errors, null, 2)}</pre></div>)
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
