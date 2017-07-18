const React = require("react")
const PropTypes = require("prop-types")

const R = require("ramda")

const utils = require("../utils")

const Bar = require("react-chartjs-2").Bar
const Pie = require("react-chartjs-2").Pie

function getColours(data) {
  let count = 0

  return data.map(function() {
    return utils.rainbow(data.length, count++)
  })
}

const ChartDisplay = React.createClass({
  displayName: "ChartDisplay",

  propTypes: {
    data: PropTypes.any.isRequired,
    onDownload: PropTypes.func,
  },

  getInitialState() {
    return {
      type: "bar",
      title: "",
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

  render() {
    const barData = {
      labels: R.pluck("name", this.props.data),
      datasets: [{
        data: R.pluck("count", this.props.data),
        backgroundColor: "#aec6cf",
        hoverBackgroundColor: "#aec6cf",
      }],
    }

    const pieData = {
      labels: R.pluck("name", this.props.data),
      datasets: [{
        data: R.pluck("count", this.props.data),
        backgroundColor: getColours(this.props.data),
        hoverBackgroundColor: getColours(this.props.data),
      }],
    }

    const barOptions = {
      title: {
        display: !!this.state.title.length,
        text: this.state.title,
      },
      tooltips: {
        displayColors: false,
      },
      legend: {
        display: false,
      },
      layout: {
        padding: {
          left: 25,
          right: 25,
          top: 25,
          bottom: 25,
        },
      },
      scales: {
        yAxes: [{
          gridLines: {
            display: false,
          },
        }],
        xAxes: [{
          gridLines: {
            display: false,
          },
        }],
      },
    }

    const pieOptions = {
      title: {
        display: !!this.state.title.length,
        text: this.state.title,
      },
      tooltips: {
        displayColors: false,
      },
      legend: {
        position: "right",
      },
      layout: {
        padding: {
          left: 25,
          right: 25,
          top: 25,
          bottom: 25,
        },
      },
      scales: {
        yAxes: [{
          display: false,
        }],
        xAxes: [{
          display: false,
        }],
      },
    }

    const chartTypeMap = {
      bar: {options: barOptions, component: Bar, data: barData},
      pie: {options: pieOptions, component: Pie, data: pieData},
    }

    const chart = chartTypeMap[this.state.type]
    const Component = chart.component

    const downloadLink = this.props.onDownload ? (<ul className="side-options right">
        <li><a className="site-link" onClick={this.onDownload}>Download</a></li>
      </ul>) : null

    return (
      <div>
        {downloadLink}
        <p className="chart-options">
          <label>Type:</label>
          <select value={this.state.type} onChange={this.onTypeChange}>
            <option value="bar">Bar</option>
            <option value="pie">Pie</option>
          </select>
          <input value={this.state.title} onChange={this.onTitleChange} placeholder="Chart name here..." />
        </p>
        <Component data={chart.data} options={chart.options} ref={(c) => this.chartComponent = c} redraw />
      </div>
    )
  },
})

module.exports = ChartDisplay
