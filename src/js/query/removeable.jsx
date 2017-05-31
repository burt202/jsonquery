const React = require("react")
const PropTypes = require("prop-types")

const {default: IconButton} = require("material-ui/IconButton")
const {default: RemoveIcon} = require("material-ui/svg-icons/content/remove-circle")
const {ListItem} = require("material-ui/List")

function Removeable({primaryText, secondaryText, onRemove}) {
  return (
    <ListItem
      primaryText={primaryText}
      secondaryText={secondaryText}
      rightIconButton={
        <IconButton onTouchTap={onRemove}>
          <RemoveIcon color="#aaa" hoverColor="#444"/>
        </IconButton>
      }
    />
  )
}

Removeable.propTypes = {
  primaryText: PropTypes.node.isRequired,
  secondaryText: PropTypes.node.isRequired,
  onRemove: PropTypes.func.isRequired,
}

module.exports = Removeable
