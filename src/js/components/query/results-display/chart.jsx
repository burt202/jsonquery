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
    formatted: PropTypes.any.isRequired,
    onDownload: PropTypes.func,
  },

  getInitialState() {
    return {
      type: "bar",
      title: "",
    }
  },

  onDownload(chartInstance) {
    this.props.onDownload(chartInstance)
  },

  onTypeChange(e) {
    this.setState({
      type: e.target.value,
    })
  },

  onTitleChange(e) {
    this.setState({
      title: e.target.value,
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
          <input value={this.state.title} onChange={this.onTitleChange} placeholder="Chart name here..." />
        </p>
        <Component data={this.props.formatted} title={this.state.title} onDownload={this.props.onDownload} />
      </div>
    )
  },
})

module.exports = ChartDisplay
