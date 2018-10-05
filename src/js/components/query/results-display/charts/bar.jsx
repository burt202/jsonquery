const React = require("react")
const PropTypes = require("prop-types")

const R = require("ramda")
const utils = require("../../../../utils")

const Bar = require("react-chartjs-2").Bar

function BarChart(props) {
  const data = {
    labels: R.keys(props.data),
    datasets: [{
      data: (props.cumulative) ? utils.getCumulative(R.values(props.data)) : R.values(props.data),
      backgroundColor: "#aec6cf",
      hoverBackgroundColor: "#aec6cf",
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
    <Bar data={data} options={options} ref={(c) => this.chartComponent = c} redraw />
  )
}

BarChart.propTypes = {
  data: PropTypes.object.isRequired,
  title: PropTypes.string,
  cumulative: PropTypes.bool.isRequired,
}

module.exports = BarChart
