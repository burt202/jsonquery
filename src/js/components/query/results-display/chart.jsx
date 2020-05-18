const React = require("react")
const useState = React.useState
const PropTypes = require("prop-types")

const Bar = require("./charts/bar")
const Pie = require("./charts/pie")

const chartTypeMap = {
  bar: Bar,
  pie: Pie,
}

function ChartDisplay(props) {
  const [state, setState] = useState({
    type: "bar",
    title: "",
  })

  const onTypeChange = e => {
    setState({
      ...state,
      type: e.target.value,
    })
  }

  const onTitleChange = e => {
    setState({
      ...state,
      title: e.target.value,
    })
  }

  const Component = chartTypeMap[state.type]

  return (
    <div>
      <p className="chart-options">
        <label>Type:</label>
        <select value={state.type} onChange={onTypeChange}>
          <option value="bar">Bar</option>
          <option value="pie">Pie</option>
        </select>
        <input value={state.title} onChange={onTitleChange} placeholder="Chart name here..." />
      </p>
      <Component data={props.formatted} title={state.title} onDownload={props.onDownload} />
    </div>
  )
}

ChartDisplay.propTypes = {
  formatted: PropTypes.any.isRequired,
  onDownload: PropTypes.func,
}

module.exports = ChartDisplay
