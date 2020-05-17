const React = require("react")
const useState = React.useState
const PropTypes = require("prop-types")

function Paste(props) {
  const [state, setState] = useState({
    data: JSON.stringify(props.data, null, 2),
  })

  const onChange = e => {
    setState({
      data: e.target.value,
    })
  }

  const onGo = () => {
    props.onAction(state.data)
  }

  return (
    <div>
      <textarea className="paste" value={state.data} onChange={onChange} />
      <button onClick={onGo}>Go</button>
    </div>
  )
}

Paste.propTypes = {
  onAction: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
}

module.exports = Paste
