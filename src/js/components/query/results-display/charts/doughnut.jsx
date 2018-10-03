const React = require("react")
const PropTypes = require("prop-types")

const R = require("ramda")
const utils = require("../../../../utils")

const Doughnut = require("react-chartjs-2").Doughnut

function getColours(data) {
  let count = 0

  return data.map(function() {
    return utils.rainbow(data.length, count++)
  })
}

function DoughnutChart(props) {
  const data = {
    labels: R.pluck("name", props.data),
    datasets: [{
      data: R.pluck("count", props.data),
      backgroundColor: getColours(props.data),
      hoverBackgroundColor: getColours(props.data),
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

  return (
    <Doughnut data={data} options={options} ref={(c) => this.chartComponent = c} redraw />
  )
}

DoughnutChart.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string,
}

module.exports = DoughnutChart
