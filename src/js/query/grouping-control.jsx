const React = require("react")
const PropTypes = require("prop-types")

const GroupingControl = React.createClass({
  displayName: "GroupingControl",

  propTypes: {
    groupings: PropTypes.array,
    options: PropTypes.array.isRequired,
    showCounts: PropTypes.bool.isRequired,
    flatten: PropTypes.bool.isRequired,
    groupSort: PropTypes.string.isRequired,
    groupLimit: PropTypes.number,
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onShowCountsChange: PropTypes.func.isRequired,
    onFlattenChange: PropTypes.func.isRequired,
    onGroupSortChange: PropTypes.func.isRequired,
    onGroupLimitChange: PropTypes.func.isRequired,
  },

  onAdd(e) {
    this.props.onAdd(e.target.value)
  },

  onShowCountsChange() {
    this.props.onShowCountsChange(!this.props.showCounts)
  },

  onFlattenChange() {
    this.props.onFlattenChange(!this.props.flatten)
  },

  onSortChange(e) {
    this.props.onGroupSortChange(e.target.value)
  },

  onLimitChange(e) {
    this.props.onGroupLimitChange(parseInt(e.target.value, 10))
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

  getFlattenOptions() {
    if (this.props.groupings.length <= 1) return null

    const disabled = !(this.props.groupings && this.props.groupings.length)

    return (
      <label className="checkbox-label">
        <input
          type="checkbox"
          name="flatten"
          disabled={disabled}
          checked={this.props.flatten}
          onChange={this.onFlattenChange}
        />
        Flatten
      </label>
    )
  },

  getSortAndLimitOptions() {
    if (!this.props.groupings.length || !this.props.showCounts) return null
    if (this.props.groupings.length > 1 && !this.props.flatten) return null

    return (
      <span>
        <select onChange={this.onSortChange} value={this.props.groupSort || ""}>
          <option value="asc">ASC</option>
          <option value="desc">DESC</option>
        </select>
        <select onChange={this.onLimitChange} value={this.props.groupLimit || ""}>
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
      </span>
    )
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
            {this.getFlattenOptions()}
            {this.getSortAndLimitOptions()}
          </div>
        </div>
      </div>
    )
  },
})

module.exports = GroupingControl
