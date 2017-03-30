const React = require("react")
const FilterRow = require("./filter-row")

const Filters = React.createClass({
  displayName: "Filters",

  propTypes: {
    actionCreator: React.PropTypes.object.isRequired,
    filters: React.PropTypes.array.isRequired,
    schema: React.PropTypes.object.isRequired,
  },

  getFilterRows: function() {
    if (!this.props.filters.length)
      return (
        <tr><td>No filters</td></tr>
      )

    return this.props.filters.map(function(filter) {
      return <FilterRow
        key={filter.id}
        filter={filter}
        type={this.props.schema[filter.name]}
        actionCreator={this.props.actionCreator}
      />
    }.bind(this))
  },

  render: function() {
    return (
      <div>
        <h3>Filters and Grouping</h3>
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
      </div>
    )
  },
})

module.exports = Filters
