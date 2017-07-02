const React = require("react")
const PropTypes = require("prop-types")

const R = require("ramda")

const Bar = require("react-chartjs-2").Bar

function ChartDisplay(props) {
  const chartData = {
    labels: R.pluck("name", props.data),
    datasets: [{data: R.pluck("count", props.data)}],
  }

  return (
    <Bar data={chartData} />
  )
}

ChartDisplay.propTypes = {
  data: PropTypes.any.isRequired,
}

module.exports = ChartDisplay
