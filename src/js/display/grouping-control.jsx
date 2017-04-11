const React = require("react")
const R = require("ramda")

const GroupingControl = React.createClass({
  displayName: "GroupingControl",

  propTypes: {
    actionCreator: React.PropTypes.object.isRequired,
    groupings: React.PropTypes.array,
    schema: React.PropTypes.object.isRequired,
    showCounts: React.PropTypes.bool.isRequired,
  },

  onGroupByChange: function(e) {
    this.props.actionCreator.addGrouping(e.target.value)
  },

  onGroupByRemove: function(field) {
    this.props.actionCreator.removeGrouping(field)
  },

  onShowCountsChange: function() {
    this.props.actionCreator.showCounts(!this.props.showCounts)
  },

  getGroupByOptions: function() {
    const options = R.without(this.props.groupings, Object.keys(this.props.schema))

    return options.map(function(value) {
      return (
        <option value={value} key={value}>{value}</option>
      )
    })
  },

  getGroupByRows: function() {
    return this.props.groupings.map(function(grouping) {
      return (
        <div className="row" key={grouping}>
          <div className="grouping">
            {grouping}
            <a className="site-link" onClick={this.onGroupByRemove.bind(this, grouping)}>remove</a>
          </div>
        </div>
      )
    }.bind(this))
  },

  render: function() {
    const disabled = !(this.props.groupings && this.props.groupings.length)

    return (
      <div className="input-control">
        <label>Group By:</label>
        <div className="body">
          {this.getGroupByRows()}
          <div className="row">
            <select onChange={this.onGroupByChange} value="">
              <option></option>
              {this.getGroupByOptions()}
            </select>
            <label className="result-field">
              <input
                type="checkbox"
                name="showCounts"
                disabled={disabled}
                checked={this.props.showCounts}
                onChange={this.onShowCountsChange}
              />
              Show counts
            </label>
          </div>
        </div>
      </div>
    )
  },
})

module.exports = GroupingControl
