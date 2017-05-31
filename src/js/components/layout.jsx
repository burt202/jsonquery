const React = require("react")
const PropTypes = require("prop-types")

const {default: Card} = require("material-ui/Card")

function Layout({left, right}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div
        style={{
          margin: 16,
          marginRight: 0,
          flexGrow: 0,
          flexShrink: 1,
          flexBasis: 360,
          maxWidth: 360,
        }}
      >
        <Card>{left}</Card>
      </div>
      <div
        style={{
          flexGrow: 1,
          flexShrink: 1,
          margin: 16,
          flexBasis: 800,
        }}
      >
        <Card>{right}</Card>
      </div>
    </div>
  )
}

Layout.propTypes = {
  left: PropTypes.node.isRequired,
  right: PropTypes.node.isRequired,
}

module.exports = Layout
