const React = require("react")
const R = require("ramda")

const GroupingControl = require("./grouping-control")

const Controls = React.createClass({
  displayName: "Controls",

  propTypes: {
    actionCreator: React.PropTypes.object.isRequired,
    filters: React.PropTypes.array.isRequired,
    groupings: React.PropTypes.array,
    sortBy: React.PropTypes.string,
    sortDirection: React.PropTypes.string,
    schema: React.PropTypes.object.isRequired,
    showCounts: React.PropTypes.bool.isRequired,
    limit: React.PropTypes.number,
    sum: React.PropTypes.string,
    average: React.PropTypes.string,
  },

  getInitialState: function() {
    return {
      lastFilteredAddedAt: null,
    }
  },

  onAddFilter: function(e) {
    this.setState({lastFilteredAddedAt: Date.now()})
    this.props.actionCreator.addFilter(e.target.value)
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

  onLimitChange: function(e) {
    this.props.actionCreator.limit(parseInt(e.target.value, 10))
  },

  onReset: function() {
    this.props.actionCreator.reset()
  },

  getFilterControl: function() {
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

  getLimitControl: function() {
    return (
      <div className="input-control">
        <label>Limit:</label>
        <div className="body">
          <div className="row">
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
        </div>
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
        <label>Average:</label>
        <div className="body">
          <div className="row">
            <select onChange={this.onAverageChange} value={this.props.average || ""}>
              <option></option>
              {this.getNumberOptions()}
            </select>
          </div>
        </div>
      </div>
    )
  },

  getSumControl: function() {
    return (
      <div className="input-control">
        <label>Sum:</label>
        <div className="body">
          <div className="row">
            <select onChange={this.onSumChange} value={this.props.sum || ""}>
              <option></option>
              {this.getNumberOptions()}
            </select>
          </div>
        </div>
      </div>
    )
  },

  getGroupByControl: function() {
    return (
      <GroupingControl
        actionCreator={this.props.actionCreator}
        groupings={this.props.groupings}
        schema={this.props.schema}
        showCounts={this.props.showCounts}
      />
    )
  },

  getSortByControl: function() {
    const options = Object.keys(this.props.schema).map(function(value) {
      return (
        <option value={value} key={value}>{value}</option>
      )
    })

    return (
      <div className="input-control">
        <label>Sort By:</label>
        <div className="body">
          <div className="row">
            <select onChange={this.onSortByChange} value={this.props.sortBy || ""}>
              <option></option>
              {options}
            </select>
            <select onChange={this.onSortDirectionChange} value={this.props.sortDirection}>
              <option value="asc">ASC</option>
              <option value="desc">DESC</option>
            </select>
          </div>
        </div>
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
