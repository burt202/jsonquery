const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")

const Bar = require("./charts/bar")
const Pie = require("./charts/pie")
const Line = require("./charts/line")
const Doughnut = require("./charts/doughnut")

const chartTypeMap = {
  bar: Bar,
  pie: Pie,
  line: Line,
  doughnut: Doughnut,
}

const ChartDisplay = createReactClass({
  displayName: "ChartDisplay",

  propTypes: {
    data: PropTypes.any.isRequired,
    onDownload: PropTypes.func,
  },

  getInitialState() {
    return {
      type: "bar",
      title: "",
      cumulative: false,
    }
  },

  onDownload() {
    this.props.onDownload(this.chartComponent.chart_instance)
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

  onCumulativeChange() {
    this.setState({
      cumulative: !this.state.cumulative,
    })
  },

  render() {
    const Component = chartTypeMap[this.state.type]

    const cumulativeCheckbox = (this.state.type === "bar" || this.state.type === "line") ? (
      <label className="checkbox-label">
        <input
          type="checkbox"
          name="cumulative"
          checked={this.state.cumulative}
          onChange={this.onCumulativeChange}
        />
        Cumulative
      </label>) : null

    return (
      <div>
        <ul className="side-options right">
          <li><a className="site-link" onClick={this.onDownload}>Download</a></li>
        </ul>
        <p className="chart-options">
          <label>Type:</label>
          <select value={this.state.type} onChange={this.onTypeChange}>
            <option value="bar">Bar</option>
            <option value="pie">Pie</option>
            <option value="doughnut">Doughnut</option>
            <option value="line">Line</option>
          </select>
          <input value={this.state.title} onChange={this.onTitleChange} placeholder="Chart name here..." />
          {cumulativeCheckbox}
        </p>
        <Component data={this.props.data} title={this.state.title} cumulative={this.state.cumulative} />
      </div>
    )
  },
})

module.exports = ChartDisplay
