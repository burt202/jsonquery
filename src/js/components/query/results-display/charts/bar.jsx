const React = require("react")
const PropTypes = require("prop-types")

const R = require("ramda")

const Bar = require("react-chartjs-2").Bar

function BarChart(props) {
  const data = {
    labels: R.pluck("name", props.data),
    datasets: [{
      data: R.pluck("reducer", props.data),
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

  function onDownload() {
    props.onDownload(this.chartComponent.chartInstance)
  }

  return (
    <div>
      <ul className="side-options right">
        <li><a className="site-link" onClick={onDownload}>Download</a></li>
      </ul>
      <Bar data={data} options={options} ref={(c) => this.chartComponent = c} redraw />
    </div>
  )
}

BarChart.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string,
  onDownload: PropTypes.func.isRequired,
}

module.exports = BarChart
