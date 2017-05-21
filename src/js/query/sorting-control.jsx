const React = require("react")
const PropTypes = require("prop-types")

const Removeable = require("./removeable")
const Inset = require("../components/inset")

const {default: SelectField} = require("material-ui/SelectField")
const {default: MenuItem} = require("material-ui/MenuItem")

const SortingControl = React.createClass({
  displayName: "SortingControl",

  propTypes: {
    sorters: PropTypes.array,
    options: PropTypes.array.isRequired,
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      field: null,
      direction: null,
    }
  },

  onChange(prop, e, index, value) {
    const toSet = {}
    toSet[prop] = value

    this.setState(toSet, function() {
      if (this.state.field !== null && this.state.direction !== null) {
        this.props.onAdd(this.state)
        this.setState(this.getInitialState())
      }
    }.bind(this))
  },

  getRows() {
    return this.props.sorters.map(function(sorter) {
      return <Removeable
        key={sorter.field + sorter.direction}
        onRemove={this.props.onRemove.bind(this, sorter.field)}
        primaryText={sorter.field}
        secondaryText={sorter.direction.toUpperCase()}
      />
    }.bind(this))
  },

  render() {
    const options = this.props.options.map(function(value) {
      return (
        <MenuItem value={value} key={value} primaryText={value}/>
      )
    })

    return (<div>
      {this.getRows()}
      <Inset vertical={false}>
        <SelectField fullWidth hintText="Field" onChange={this.onChange.bind(this, "field")} value={this.state.field || ""}>
          {options}
        </SelectField>
        <SelectField fullWidth hintText="Direction" onChange={this.onChange.bind(this, "direction")} value={this.state.direction || ""}>
          <MenuItem value="asc" primaryText="ASC"/>
          <MenuItem value="desc" primaryText="DESC"/>
        </SelectField>
      </Inset>
    </div>)
  },
})

module.exports = SortingControl
