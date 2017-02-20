const React = require("react")

function fetchData(url) {
  return fetch(url, {method: "get"})
  .then(function(response) {
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
  },

  onFetchComplete: function(data) {
    const schema = decodeURIComponent(this.props.params.schema)

    const errors = []

    if (errors.length) {
      this.setState({errors: errors})
      return
    }

    this.props.actionCreator.saveJson("data", data)
    this.props.actionCreator.saveJson("schema", JSON.parse(schema))
  },

  render: function() {
    if (this.state.errors) {
      return <div>errors here</div>
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
