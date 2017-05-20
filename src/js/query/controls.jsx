const React = require("react")
const PropTypes = require("prop-types")
const R = require("ramda")

const GroupingControl = require("./grouping-control")
const SortingControl = require("./sorting-control")

const Controls = React.createClass({
  displayName: "Controls",

  propTypes: {
    actionCreator: PropTypes.object.isRequired,
    groupings: PropTypes.array,
    sorters: PropTypes.array,
    schema: PropTypes.object.isRequired,
    showCounts: PropTypes.bool.isRequired,
    limit: PropTypes.number,
    sum: PropTypes.string,
    average: PropTypes.string,
  },

  onSumChange(e) {
    this.props.actionCreator.sum(e.target.value)
  },

  onAverageChange(e) {
    this.props.actionCreator.average(e.target.value)
  },

  onLimitChange(e) {
    this.props.actionCreator.limit(parseInt(e.target.value, 10))
  },

  getLimitControl() {
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

  getNumberOptions() {
    const numberOptions = R.pipe(
      R.toPairs,
      R.filter(R.compose(R.equals("number"), R.prop(1))),
      R.map(R.prop(0))
    )(this.props.schema)

    return numberOptions.map(function(value) {
      return (
        <option value={value} key={value}>{value}</option>
      )
    })
  },

  getAverageControl() {
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

  getSumControl() {
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

  getGroupByControl() {
    const options = R.without(this.props.groupings, Object.keys(this.props.schema))

    return (
      <GroupingControl
        groupings={this.props.groupings}
        options={options}
        showCounts={this.props.showCounts}
        onAdd={this.props.actionCreator.addGrouping}
        onRemove={this.props.actionCreator.removeGrouping}
        onShowCountsChange={this.props.actionCreator.showCounts}
      />
    )
  },

  getSortByControl() {
    const options = R.without(R.pluck("field", this.props.sorters), Object.keys(this.props.schema))

    return (
      <SortingControl
        sorters={this.props.sorters}
        options={options}
        onAdd={this.props.actionCreator.addSorter}
        onRemove={this.props.actionCreator.removeSorter}
      />
    )
  },

  render() {
    return (
      <div>
        <h3>Controls</h3>
        {this.getSortByControl()}
        {this.getLimitControl()}
        <br />
        {this.getGroupByControl()}
        {this.getAverageControl()}
        {this.getSumControl()}
      </div>
    )
  },
})

module.exports = Controls
