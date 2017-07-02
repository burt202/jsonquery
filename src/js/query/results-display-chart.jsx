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
  },

  getInitialState() {
    return {
      type: "bar",
      title: "",
    }
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

    return (
      <div>
        <p><input value={this.state.title} onChange={this.onTitleChange} placeholder="Chart name here..." /></p>
        <Component data={chartData} options={options} />
      </div>
    )
  },
})

module.exports = ChartDisplay
