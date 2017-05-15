const React = require("react")

const testData = require("../../test-data.json")

const Paste = React.createClass({
  displayName: "Paste",

  propTypes: {
    onAction: React.PropTypes.func.isRequired,
  },

  getInitialState: function() {
    return {
      data: JSON.stringify(testData, null, 2),
    }
  },

  onChange: function(e) {
    this.setState({
      data: e.target.value,
    })
  },

  onGo: function() {
    this.props.onAction(this.state.data)
  },

  render: function() {
    return (
      <div>
        <textarea value={this.state.data} onChange={this.onChange} />
        <button onClick={this.onGo}>Go</button>
      </div>
    )
  },
})

module.exports = Paste
