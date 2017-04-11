const React = require("react")

const GroupingControl = React.createClass({
  displayName: "GroupingControl",

  propTypes: {
    groupings: React.PropTypes.array,
    options: React.PropTypes.array.isRequired,
    showCounts: React.PropTypes.bool.isRequired,
    onAdd: React.PropTypes.func.isRequired,
    onRemove: React.PropTypes.func.isRequired,
    onShowCountsChange: React.PropTypes.func.isRequired,
  },

  onAdd: function(e) {
    this.props.onAdd(e.target.value)
  },

  onShowCountsChange: function() {
    this.props.onShowCountsChange(!this.props.showCounts)
  },

  getRows: function() {
    return this.props.groupings.map(function(grouping) {
      return (
        <div className="row" key={grouping}>
          <div className="grouping">
            {grouping}
            <a className="site-link" onClick={this.props.onRemove.bind(this, grouping)}>remove</a>
          </div>
        </div>
      )
    }.bind(this))
  },

  render: function() {
    const disabled = !(this.props.groupings && this.props.groupings.length)

    const options = this.props.options.map(function(value) {
      return (
        <option value={value} key={value}>{value}</option>
      )
    })

    return (
      <div className="input-control">
        <label>Group By:</label>
        <div className="body">
          {this.getRows()}
          <div className="row">
            <select onChange={this.onAdd} value="">
              <option></option>
              {options}
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
