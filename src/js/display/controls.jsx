const React = require("react")
const R = require("ramda")

const Controls = React.createClass({
  displayName: "Controls",

  propTypes: {
    actionCreator: React.PropTypes.object.isRequired,
    filters: React.PropTypes.array.isRequired,
    groupBy: React.PropTypes.string,
    sortBy: React.PropTypes.string,
    sortDirection: React.PropTypes.string,
    schema: React.PropTypes.object.isRequired,
    showCounts: React.PropTypes.bool.isRequired,
  },

  onAddFilter: function(e) {
    this.props.actionCreator.addFilter(e.target.value)
  },

  onGroupByChange: function(e) {
    this.props.actionCreator.groupBy(e.target.value)
  },

  onSortByChange: function(e) {
    this.props.actionCreator.sortBy(e.target.value)
  },

  onSortDirectionChange: function(e) {
    this.props.actionCreator.sortDirection(e.target.value)
  },

  onReset: function() {
    this.props.actionCreator.reset()
  },

  getFilterOptions: function() {
    const filterOptions = R.pipe(
      R.keys,
      R.without(R.pluck("name", this.props.filters))
    )(this.props.schema)

    return filterOptions.map(function(value) {
      return (
        <option value={value} key={value}>{value}</option>
      )
    })
  },

  getFilterControl: function() {
    return (
      <div className="input-control">
        <span>Add Filter:</span>
        <select onChange={this.onAddFilter}>
          <option></option>
          {this.getFilterOptions()}
        </select>
      </div>
    )
  },

  getGroupAndSortByOptions: function() {
    return Object.keys(this.props.schema).map(function(value) {
      return (
        <option value={value} key={value}>{value}</option>
      )
    })
  },

  onChangeHandler: function() {
    this.props.actionCreator.showCounts(!this.props.showCounts)
  },

  getGroupByControl: function() {
    return (
      <div className="input-control">
        <span>Group By:</span>
        <select onChange={this.onGroupByChange} value={this.props.groupBy || ""}>
          <option></option>
          {this.getGroupAndSortByOptions()}
        </select>
        <label className="result-field">
          <input type="checkbox" name="showCounts" checked={this.props.showCounts} onChange={this.onChangeHandler} />
          Show counts
        </label>
      </div>
    )
  },

  getSortByControl: function() {
    return (
      <div className="input-control">
        <span>Sort By:</span>
        <select onChange={this.onSortByChange} value={this.props.sortBy || ""}>
          <option></option>
          {this.getGroupAndSortByOptions()}
        </select>
        <select onChange={this.onSortDirectionChange} value={this.props.sortDirection}>
          <option value="asc">ASC</option>
          <option value="desc">DESC</option>
        </select>
      </div>
    )
  },

  getResetControl: function() {
    return (
      <p><a className="site-link" onClick={this.onReset}>Reset</a></p>
    )
  },

  render: function() {
    return (
      <div>
        {this.getFilterControl()}
        {this.getGroupByControl()}
        {this.getSortByControl()}
        {this.getResetControl()}
      </div>
    )
  },
})

module.exports = Controls
