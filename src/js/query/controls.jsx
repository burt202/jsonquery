const React = require("react")
const PropTypes = require("prop-types")
const R = require("ramda")

const GroupingControl = require("./grouping-control")
const SortingControl = require("./sorting-control")
const LimitControl = require("../components/limit-control")

const Controls = React.createClass({
  displayName: "Controls",

  propTypes: {
    actionCreator: PropTypes.object.isRequired,
    groupings: PropTypes.array,
    sorters: PropTypes.array,
    schema: PropTypes.object.isRequired,
    showCounts: PropTypes.bool.isRequired,
    combineRemainder: PropTypes.bool.isRequired,
    groupSort: PropTypes.string.isRequired,
    groupLimit: PropTypes.number,
    limit: PropTypes.number,
    analyse: PropTypes.string,
  },

  onAnalyseChange(e) {
    this.props.actionCreator.analyse(e.target.value)
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
            <LimitControl
              onChange={this.onLimitChange}
              value={this.props.limit}
            />
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

  getAnalyseControl() {
    return (
      <div className="input-control">
        <label>Analyse:</label>
        <div className="body">
          <div className="row">
            <select onChange={this.onAnalyseChange} value={this.props.analyse || ""}>
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
        groupSort={this.props.groupSort}
        groupLimit={this.props.groupLimit}
        onAdd={this.props.actionCreator.addGrouping}
        onRemove={this.props.actionCreator.removeGrouping}
        onShowCountsChange={this.props.actionCreator.showCounts}
        onGroupSortChange={this.props.actionCreator.groupSort}
        onGroupLimitChange={this.props.actionCreator.groupLimit}
        combineRemainder={this.props.combineRemainder}
        onCombineRemainderChange={this.props.actionCreator.combineRemainder}
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
        {this.getAnalyseControl()}
      </div>
    )
  },
})

module.exports = Controls
