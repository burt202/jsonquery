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
    limit: React.PropTypes.number,
    sum: React.PropTypes.string,
    average: React.PropTypes.string,
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

  onSumChange: function(e) {
    this.props.actionCreator.sum(e.target.value)
  },

  onAverageChange: function(e) {
    this.props.actionCreator.average(e.target.value)
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

  onLimitChange: function(e) {
    this.props.actionCreator.limit(parseInt(e.target.value, 10))
  },

  getLimitControl: function() {
    return (
      <div className="input-control">
        <span>Limit:</span>
        <select onChange={this.onLimitChange} value={this.props.limit || ""}>
          <option>Show all</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="75">75</option>
          <option value="100">100</option>
          <option value="150">150</option>
          <option value="200">200</option>
          <option value="250">250</option>
          <option value="500">500</option>
        </select>
      </div>
    )
  },

  getNumberOptions: function() {
    const numberOptions = R.pipe(
      R.toPairs,
      R.filter(R.compose(R.equals("int"), R.prop(1))),
      R.map(R.prop(0))
    )(this.props.schema)

    return numberOptions.map(function(value) {
      return (
        <option value={value} key={value}>{value}</option>
      )
    })
  },

  getAverageControl: function() {
    return (
      <div className="input-control">
        <span>Average:</span>
        <select onChange={this.onAverageChange} value={this.props.average || ""}>
          <option></option>
          {this.getNumberOptions()}
        </select>
      </div>
    )
  },

  getSumControl: function() {
    return (
      <div className="input-control">
        <span>Sum:</span>
        <select onChange={this.onSumChange} value={this.props.sum || ""}>
          <option></option>
          {this.getNumberOptions()}
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
    const disabled = !this.props.groupBy

    return (
      <div className="input-control">
        <span>Group By:</span>
        <select onChange={this.onGroupByChange} value={this.props.groupBy || ""}>
          <option></option>
          {this.getGroupAndSortByOptions()}
        </select>
        <label className="result-field">
          <input type="checkbox" name="showCounts" disabled={disabled} checked={this.props.showCounts} onChange={this.onChangeHandler} />
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
        {this.getSortByControl()}
        {this.getLimitControl()}
        <br />
        {this.getGroupByControl()}
        {this.getAverageControl()}
        {this.getSumControl()}
        {this.getResetControl()}
      </div>
    )
  },
})

module.exports = Controls
