const React = require("react")
const PropTypes = require("prop-types")

const style = {
  marginBottom: 16,
}

function SpaceAfter({children}) {
  return <div style={style}>{children}</div>
}

SpaceAfter.propTypes = {
  children: PropTypes.node.isRequired,
}

module.exports = SpaceAfter
