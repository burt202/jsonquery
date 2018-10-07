/* eslint react/no-find-dom-node: 0 */

const React = require("react")
const ReactDOM = require("react-dom")
const PropTypes = require("prop-types")

const R = require("ramda")

const Recharts = require("recharts")
const {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip} = Recharts

function BarChartComponent(props) {
  const data = R.pipe(
    R.toPairs,
    R.map(function(pair) {
      return {name: pair[0], value: pair[1]}
    })
  )(props.data)

  function onDownload() {
    const chartSVG = ReactDOM.findDOMNode(this.currentChart).children[0]
    props.onDownload(chartSVG)
  }

  return (
    <div>
      <ul className="side-options right">
        <li><a className="site-link" onClick={onDownload}>Download</a></li>
      </ul>
      <BarChart width={600} height={300} data={data} ref={(chart) => this.currentChart = chart}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="name"/>
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </div>
  )
}

BarChartComponent.propTypes = {
  data: PropTypes.object.isRequired,
  onDownload: PropTypes.func.isRequired,
}

module.exports = BarChartComponent
