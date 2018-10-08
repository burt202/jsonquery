const React = require("react")
const PropTypes = require("prop-types")

const R = require("ramda")
const utils = require("../../../../utils")

const Pie = require("react-chartjs-2").Pie

function getColours(length) {
  let count = 0

  return R.range(1, length).map(function() {
    return utils.rainbow(length, count++)
  })
}

function PieChart(props) {
  const data = {
    labels: R.pluck("name", props.data),
    datasets: [{
      data: R.pluck("reducer", props.data),
      backgroundColor: getColours(props.data.length),
      hoverBackgroundColor: getColours(props.data.length),
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

  function onDownload() {
    props.onDownload(this.chartComponent.chartInstance)
  }

  return (
    <div>
      <ul className="side-options right">
        <li><a className="site-link" onClick={onDownload}>Download</a></li>
      </ul>
      <Pie data={data} options={options} ref={(c) => this.chartComponent = c} redraw />
    </div>
  )
}

PieChart.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string,
  onDownload: PropTypes.func.isRequired,
}

module.exports = PieChart
