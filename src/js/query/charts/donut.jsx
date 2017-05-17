const React = require("react")

const R = require("ramda")
const Doughnut = require("react-chartjs-2").Doughnut

const rainbow = require("./util/color").rainbow

function groupedToChartData(data) {
  const initial = {labels: [], datasets: [{
    data: [],
    backgroundColor: [],
  }]}

  var count = 0

  const formattedData = R.sortBy(R.prop(0), R.toPairs(R.map(R.length, data)))

  return R.reduce(function(acc, v) {
    const key = v[0]
    const value = v[1]

    acc.labels.push(key)
    acc.datasets[0].data.push(value)
    acc.datasets[0].backgroundColor.push(rainbow(
      Object.keys(formattedData).length,
      count++
    ))

    return acc
  }, initial, formattedData)
}

module.exports = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
  },

  displayName: "Donut",

  render: function() {
    return <Doughnut
      data={groupedToChartData(this.props.data)}
      options={{
        legend: {
          position: "right",
        },
      }}
    />
  },
})
