const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")

const Bar = require("./charts/bar")
const Pie = require("./charts/pie")

const chartTypeMap = {
  bar: Bar,
  pie: Pie,
}

const ChartDisplay = createReactClass({
  displayName: "ChartDisplay",

  propTypes: {
    formatted: PropTypes.object.isRequired,
    onDownload: PropTypes.func,
  },

  getInitialState() {
    return {
      type: "bar",
    }
  },

  onDownload(chart) {
    this.props.onDownload(chart)
  },

  onTypeChange(e) {
    this.setState({
      type: e.target.value,
    })
  },

  render() {
    const Component = chartTypeMap[this.state.type]

    return (
      <div>
        <p className="chart-options">
          <label>Type:</label>
          <select value={this.state.type} onChange={this.onTypeChange}>
            <option value="bar">Bar</option>
            <option value="pie">Pie</option>
          </select>
        </p>
        <Component data={this.props.formatted} onDownload={this.props.onDownload} />
      </div>
    )
  },
})

module.exports = ChartDisplay
