const React = require("react")
const useState = React.useState
const PropTypes = require("prop-types")

const {Button, Input} = require("antd")
const {TextArea} = Input

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
      <div style={{marginBottom: 8}}>
        <TextArea value={state.data} onChange={onChange} rows={20} />
      </div>
      <Button type="primary" onClick={onGo}>
        Go
      </Button>
    </div>
  )
}

Paste.propTypes = {
  onAction: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
}

module.exports = Paste
