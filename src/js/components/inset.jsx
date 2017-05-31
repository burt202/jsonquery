const React = require("react")
const PropTypes = require("prop-types")

const SIZE = 16

function Inset({children, horizontal, vertical}) {
  return <div style={{
    paddingLeft: horizontal ? SIZE : 0,
    paddingRight: horizontal ? SIZE : 0,
    paddingTop: vertical ? SIZE : 0,
    paddingBottom: vertical ? SIZE : 0,
  }}>{children}</div>
}

Inset.defaultProps = {
  horizontal: true,
  vertical: true,
}

Inset.propTypes = {
  children: PropTypes.node.isRequired,
  horizontal: PropTypes.bool.isRequired,
  vertical: PropTypes.bool.isRequired,
}

module.exports = Inset
