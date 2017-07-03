const React = require("react")
const PropTypes = require("prop-types")

const R = require("ramda")

const Bar = require("react-chartjs-2").Bar

const chartTypeMap = {
  bar: Bar,
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

  onTitleChange(e) {
    this.setState({
      title: e.target.value,
    })
  },

  render() {
    const chartData = {
      labels: R.pluck("name", this.props.data),
      datasets: [{data: R.pluck("count", this.props.data)}],
    }

    const options = {
      title: {
        display: !!this.state.title.length,
        text: this.state.title,
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

    const Component = chartTypeMap[this.state.type]

    const downloadLink = this.props.onDownload ? (<ul className="side-options right">
        <li><a className="site-link" onClick={this.onDownload}>Download</a></li>
      </ul>) : null

    return (
      <div>
        {downloadLink}
        <p><input value={this.state.title} onChange={this.onTitleChange} placeholder="Chart name here..." /></p>
        <Component data={chartData} options={options} ref={(c) => this.chartComponent = c} />
      </div>
    )
  },
})

module.exports = ChartDisplay
