const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")
const FilterRow = require("./row")

const Filters = createReactClass({
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

  onAddFilter(e) {
    this.setState({lastFilteredAddedAt: Date.now()})
    this.props.actionCreator.addFilter(e.target.value)
  },

  getFilterControl() {
    const options = Object.keys(this.props.schema).map(function(value) {
      return (
        <option value={value} key={value}>{value}</option>
      )
    })

    return (
      <div className="input-control">
        <label>Add Filter:</label>
        <div className="body">
          <div className="row">
            <select onChange={this.onAddFilter} key={this.state.lastFilteredAddedAt}>
              <option></option>
              {options}
            </select>
          </div>
        </div>
      </div>
    )
  },

  getFilterRows() {
    if (!this.props.filters.length)
      return (
        <tr><td>No filters</td></tr>
      )

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
        <h3>Filters</h3>
        <table className="table filters">
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.getFilterRows()}
          </tbody>
        </table>
        {this.getFilterControl()}
      </div>
    )
  },
})

module.exports = Filters
