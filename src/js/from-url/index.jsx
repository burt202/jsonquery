const React = require("react")

const validator = require("../services/validator")

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
    actionCreator: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired,
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
    const schema = decodeURIComponent(this.props.params.schema)

    const errors = []

    if (!validator.isArray(data)) {
      errors.push("Data must be an array")
    }

    if (!validator.isValidJSON(schema)) {
      errors.push("Schema must be valid JSON")
    }

    if (!validator.isObject("object", schema)) {
      errors.push("Schema must be an object")
    }

    if (errors.length) {
      this.setState({errors: errors})
      return
    }

    this.props.actionCreator.saveJson("data", data)
    this.props.actionCreator.saveJson("schema", JSON.parse(schema))
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
