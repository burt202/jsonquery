const React = require("react")
const PropTypes = require("prop-types")
const R = require("ramda")

const GroupingControl = require("./grouping-control")
const SortingControl = require("./sorting-control")

const Inset = require("../components/inset")

const {default: Subheader} = require("material-ui/Subheader")
const {default: SelectField} = require("material-ui/SelectField")
const {default: MenuItem} = require("material-ui/MenuItem")
const {default: Divider} = require("material-ui/Divider")

const LIMITS = [1, 2, 3, 5, 10, 20, 50, 75, 100, 150, 200, 250, 500]

const Controls = React.createClass({
  displayName: "Controls",

  propTypes: {
    actionCreator: PropTypes.object.isRequired,
    groupings: PropTypes.array,
    sorters: PropTypes.array,
    schema: PropTypes.object.isRequired,
    showCounts: PropTypes.bool.isRequired,
    limit: PropTypes.number,
    analyse: PropTypes.string,
  },

  onAnalyseChange(e, index, value) {
    this.props.actionCreator.analyse(e.target.value)
  },

  onLimitChange(e, index, value) {
    this.props.actionCreator.limit(parseInt(value, 10))
  },

  getLimitControl() {
    return (<SelectField fullWidth value={this.props.limit || 0} onChange={this.onLimitChange}>
      <MenuItem key="all" primaryText="Show all" value={0}/>
      {LIMITS.map((v) => <MenuItem key={v} value={v} primaryText={v}/>)}
    </SelectField>)
  },

  getNumberOptions() {
    const numberOptions = R.pipe(
      R.toPairs,
      R.filter(R.compose(R.equals("number"), R.prop(1))),
      R.map(R.prop(0))
    )(this.props.schema)

    return numberOptions.map(function(value) {
      return (
        <MenuItem value={value} key={value} primaryText={value}/>
      )
    })
  },

  getAnalyseControl() {
    return (<SelectField fullWidth value={this.props.analyse} floatingLabelText="Analyse" onChange={this.onAnalyseChange}>
      <MenuItem value={null} primaryText=""/>
      {this.getNumberOptions()}
    </SelectField>)
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
        <Subheader>Sort</Subheader>
        {this.getSortByControl()}
        <Divider/>

        <Subheader>Group</Subheader>
        {this.getGroupByControl()}
        <Divider/>

        <Subheader>Limit</Subheader>
        <Inset vertical={false}>
          {this.getLimitControl()}
        </Inset>
        <Divider/>

        <Subheader>Analyse</Subheader>
        <Inset vertical={false}>
          {this.getAnalyseControl()}
        </Inset>
      </div>
    )
  },
})

module.exports = Controls
