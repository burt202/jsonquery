const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")

const Paste = createReactClass({
  displayName: "Paste",

  propTypes: {
    onAction: PropTypes.func.isRequired,
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  },

  getInitialState() {
    return {
      data: JSON.stringify(this.props.data, null, 2),
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
