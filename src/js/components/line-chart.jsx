const React = require("react")
const PropTypes = require("prop-types")

const R = require("ramda")
const utils = require("../utils")

const Line = require("react-chartjs-2").Line

function LineChart(props) {
  const data = {
    labels: R.pluck("name", props.data),
    datasets: [{
      data: (props.cumulative) ? utils.getCumulative(R.pluck("count", props.data)) : R.pluck("count", props.data),
    }],
  }

  const options = {
    title: {
      display: !!props.title.length,
      text: props.title,
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

  return (
    <Line data={data} options={options} ref={(c) => this.chartComponent = c} redraw />
  )
}

LineChart.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string,
  cumulative: PropTypes.bool.isRequired,
}

module.exports = LineChart
