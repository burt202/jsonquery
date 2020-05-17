const React = require("react")
const PropTypes = require("prop-types")

const R = require("ramda")

const SortingControl = require("./sorting")
const LimitControl = require("./limit")
const GroupingControl = require("./grouping")
const AnalyseControl = require("./analyse")

function Controls(props) {
  const getSortByControl = () => {
    const options = R.without(R.pluck("field", props.sorters), Object.keys(props.schema))

    return (
      <SortingControl
        sorters={props.sorters}
        options={options}
        onAdd={props.actionCreator.addSorter}
        onRemove={props.actionCreator.removeSorter}
      />
    )
  }

  const getLimitControl = () => {
    return <LimitControl onChange={props.actionCreator.limit} value={props.limit} />
  }

  const getGroupByControl = () => {
    return (
      <GroupingControl
        groupings={props.groupings}
        schema={props.schema}
        groupReducer={props.groupReducer}
        groupSort={props.groupSort}
        groupLimit={props.groupLimit}
        onAdd={props.actionCreator.addGrouping}
        onRemove={props.actionCreator.removeGrouping}
        onGroupReducerChange={props.actionCreator.groupReducer}
        onGroupReducerMetaChange={props.actionCreator.groupReducerMeta}
        onGroupSortChange={props.actionCreator.groupSort}
        onGroupLimitChange={props.actionCreator.groupLimit}
        combineRemainder={props.combineRemainder}
        onCombineRemainderChange={props.actionCreator.combineRemainder}
      />
    )
  }

  const getAnalyseControl = () => {
    return (
      <AnalyseControl
        value={props.analyse}
        schema={props.schema}
        onChange={props.actionCreator.analyse}
      />
    )
  }

  return (
    <div>
      <h3>Controls</h3>
      {getSortByControl()}
      {getLimitControl()}
      <br />
      {getGroupByControl()}
      {getAnalyseControl()}
    </div>
  )
}

Controls.propTypes = {
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
}

module.exports = Controls
