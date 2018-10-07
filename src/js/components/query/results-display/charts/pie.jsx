/* eslint react/no-find-dom-node: 0 */

const React = require("react")
const ReactDOM = require("react-dom")
const PropTypes = require("prop-types")

const R = require("ramda")

const Recharts = require("recharts")
const {PieChart, Pie, Tooltip} = Recharts

function PieChartComponent(props) {
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
      <PieChart width={600} height={300}>
        <Pie isAnimationActive={false} data={data} cx={200} cy={200} outerRadius={80} fill="#8884d8" label ref={(chart) => this.currentChart = chart} />
        <Tooltip/>
      </PieChart>
    </div>
  )
}

PieChartComponent.propTypes = {
  data: PropTypes.object.isRequired,
  onDownload: PropTypes.func.isRequired,
}

module.exports = PieChartComponent
