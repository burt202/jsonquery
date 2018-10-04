const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")
const R = require("ramda")

const SortingControl = require("./sorting")
const LimitControl = require("./limit")
const GroupingControl = require("./grouping")
const AnalyseControl = require("./analyse")

const Controls = createReactClass({
  displayName: "Controls",

  propTypes: {
    actionCreator: PropTypes.object.isRequired,
    groupings: PropTypes.array,
    sorters: PropTypes.array,
    schema: PropTypes.object.isRequired,
    groupReducer: PropTypes.object,
    combineRemainder: PropTypes.bool.isRequired,
    groupSort: PropTypes.string.isRequired,
    groupLimit: PropTypes.number,
    limit: PropTypes.number,
    analyse: PropTypes.string,
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

  getLimitControl() {
    return (
      <LimitControl
        onChange={this.props.actionCreator.limit}
        value={this.props.limit}
      />
    )
  },

  getGroupByControl() {
    return (
      <GroupingControl
        groupings={this.props.groupings}
        schema={this.props.schema}
        groupReducer={this.props.groupReducer}
        groupSort={this.props.groupSort}
        groupLimit={this.props.groupLimit}
        onAdd={this.props.actionCreator.addGrouping}
        onRemove={this.props.actionCreator.removeGrouping}
        onGroupReducerChange={this.props.actionCreator.groupReducer}
        onGroupReducerMetaChange={this.props.actionCreator.groupReducerMeta}
        onGroupSortChange={this.props.actionCreator.groupSort}
        onGroupLimitChange={this.props.actionCreator.groupLimit}
        combineRemainder={this.props.combineRemainder}
        onCombineRemainderChange={this.props.actionCreator.combineRemainder}
      />
    )
  },

  getAnalyseControl() {
    return (
      <AnalyseControl
        value={this.props.analyse}
        schema={this.props.schema}
        onChange={this.props.actionCreator.analyse}
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
