const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")

const testData = require("../../../test-data.json")

const Paste = createReactClass({
  displayName: "Paste",

  propTypes: {
    onAction: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      data: JSON.stringify(testData, null, 2),
    }
  },

  onChange(e) {
    this.setState({
      data: e.target.value,
    })
  },

  onGo() {
    this.props.onAction(this.state.data)
  },

  render() {
    return (
      <div>
        <textarea className="paste" value={this.state.data} onChange={this.onChange} />
        <button onClick={this.onGo}>Go</button>
      </div>
    )
  },
})

module.exports = Paste
