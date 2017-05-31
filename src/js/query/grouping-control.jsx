const React = require("react")
const PropTypes = require("prop-types")

const Inset = require("../components/inset")
const SpaceAfter = require("../components/space-after")

const Removeable = require("./removeable")

const {default: SelectField} = require("material-ui/SelectField")
const {default: MenuItem} = require("material-ui/MenuItem")
const {default: Checkbox} = require("material-ui/Checkbox")

const GroupingControl = React.createClass({
  displayName: "GroupingControl",

  propTypes: {
    groupings: PropTypes.array,
    options: PropTypes.array.isRequired,
    showCounts: PropTypes.bool.isRequired,
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onShowCountsChange: PropTypes.func.isRequired,
  },

  onAdd(e, index, value) {
    this.props.onAdd(value)
  },

  onShowCountsChange() {
    this.props.onShowCountsChange(!this.props.showCounts)
  },

  getRows() {
    return this.props.groupings.map(function(grouping) {
      return <Removeable
        key={grouping}
        onRemove={this.props.onRemove.bind(this, grouping)}
        primaryText={grouping}
      />
    }.bind(this))
  },

  render() {
    const disabled = !(this.props.groupings && this.props.groupings.length)

    const options = this.props.options.map(function(value) {
      return (
        <MenuItem value={value} key={value} primaryText={value}/>
      )
    })

    return (<div>
      {this.getRows()}
      <Inset vertical={false}>
        <SpaceAfter>
          <SelectField fullWidth onChange={this.onAdd} hintText="Field" value="">
            {options}
          </SelectField>
          <Checkbox
            label="Show counts"
            checked={this.props.showCounts}
            disabled={disabled}
            onCheck={this.onShowCountsChange}
          />
        </SpaceAfter>
      </Inset>
    </div>)
  },
})

module.exports = GroupingControl
