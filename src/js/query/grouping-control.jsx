const React = require("react")
const PropTypes = require("prop-types")

const GroupingControl = React.createClass({
  displayName: "GroupingControl",

  propTypes: {
    groupings: PropTypes.array,
    options: PropTypes.array.isRequired,
    showCounts: PropTypes.bool.isRequired,
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onShowCountsChange: PropTypes.func.isRequired,
  },

  onAdd(e) {
    this.props.onAdd(e.target.value)
  },

  onShowCountsChange() {
    this.props.onShowCountsChange(!this.props.showCounts)
  },

  getRows() {
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

  render() {
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
            <label className="checkbox-label">
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
