const React = require("react")
const PropTypes = require("prop-types")

const testData = require("../../test-data.json")

const Inset = require("../components/inset")
const SpaceAfter = require("../components/space-after")

const {default: RaisedButton} = require("material-ui/RaisedButton")

const Paste = React.createClass({
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
      <Inset>
        <SpaceAfter>
          <textarea style={{width: "100%", height: 512}} value={this.state.data} onChange={this.onChange} />
        </SpaceAfter>
        <RaisedButton secondary onTouchTap={this.onGo} label="Go"/>
      </Inset>
    )
  },
})

module.exports = Paste
