const React = require("react")
const PropTypes = require("prop-types")
const FilterRow = require("./filter-row")

const Inset = require("../components/inset")

const {default: Subheader} = require("material-ui/Subheader")
const {default: SelectField} = require("material-ui/SelectField")
const {default: MenuItem} = require("material-ui/MenuItem")

const Filters = React.createClass({
  displayName: "Filters",

  propTypes: {
    actionCreator: PropTypes.object.isRequired,
    filters: PropTypes.array.isRequired,
    schema: PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      lastFilteredAddedAt: null,
    }
  },

  onAddFilter(e, index, value) {
    this.setState({lastFilteredAddedAt: Date.now()})
    this.props.actionCreator.addFilter(value)
  },

  getFilterControl() {
    const options = Object.keys(this.props.schema).map(function(value) {
      return (
        <MenuItem value={value} key={value} primaryText={value}/>
      )
    })

    return (<SelectField
      fullWidth
      onChange={this.onAddFilter}
      hintText={"Field"}
    >
      {options}
    </SelectField>)
  },

  getFilterRows() {
    return this.props.filters.map(function(filter) {
      return <FilterRow
        key={filter.id}
        filter={filter}
        type={this.props.schema[filter.name]}
        onToggle={this.props.actionCreator.toggleFilter}
        onUpdate={this.props.actionCreator.updateFilter}
        onDelete={this.props.actionCreator.deleteFilter}
      />
    }.bind(this))
  },

  render() {
    return (
      <div>
        <Subheader>Filter</Subheader>
        <Inset vertical={false}>
          {this.getFilterRows()}
          {this.getFilterControl()}
        </Inset>
      </div>
    )
  },
})

module.exports = Filters
