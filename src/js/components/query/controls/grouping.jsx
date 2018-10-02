const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")

const GroupingControl = createReactClass({
  displayName: "GroupingControl",

  propTypes: {
    groupings: PropTypes.array,
    options: PropTypes.array.isRequired,
    groupReducer: PropTypes.object,
    groupSort: PropTypes.string.isRequired,
    groupLimit: PropTypes.number,
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onGroupReducerChange: PropTypes.func.isRequired,
    onGroupSortChange: PropTypes.func.isRequired,
    onGroupLimitChange: PropTypes.func.isRequired,
    combineRemainder: PropTypes.bool.isRequired,
    onCombineRemainderChange: PropTypes.func.isRequired,
  },

  onAdd(e) {
    this.props.onAdd(e.target.value)
  },

  onGroupReducerChange(e) {
    const groupReducer = (e.target.value && e.target.value.length) ? {name: e.target.value} : null
    this.props.onGroupReducerChange(groupReducer)
  },

  onSortChange(e) {
    this.props.onGroupSortChange(e.target.value)
  },

  onLimitChange(e) {
    const groupLimit = (e.target.value && e.target.value.length) ? parseInt(e.target.value, 10) : null
    this.props.onGroupLimitChange(groupLimit)
  },

  onCombineRemainderChange() {
    this.props.onCombineRemainderChange(!this.props.combineRemainder)
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

  getSortAndLimitOptions() {
    if (!this.props.groupings.length || !this.props.groupReducer) return null

    let options = [
      {value: "desc", name: "Count DESC"},
      {value: "asc", name: "Count ASC"},
      {value: "namedesc", name: "Name DESC"},
      {value: "nameasc", name: "Name ASC"},
    ]

    if (this.props.groupings.length > 1) {
      options = options.concat([
        {value: "pathdesc", name: "Path DESC"},
        {value: "pathasc", name: "Path ASC"},
      ])
    }

    if (this.props.groupings.length === 1) {
      options = options.concat([
        {value: "natural", name: "Natural"},
      ])
    }

    const combineRemainderInput = (this.props.groupLimit) ? (
      <label className="checkbox-label">
        <input
          type="checkbox"
          name="combineRemainder"
          checked={this.props.combineRemainder}
          onChange={this.onCombineRemainderChange}
        />
        Combine remainder
      </label>) : null

    return (
      <span>
        <select onChange={this.onSortChange} value={this.props.groupSort || ""}>
          {options.map(function(option) {
            return <option key={option.value} value={option.value}>{option.name}</option>
          })}
        </select>
        <select onChange={this.onLimitChange} value={this.props.groupLimit || ""}>
          <option value="">Show all</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="5">5</option>
          <option value="8">8</option>
          <option value="10">10</option>
          <option value="12">12</option>
          <option value="15">15</option>
          <option value="20">20</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="75">75</option>
          <option value="100">100</option>
          <option value="150">150</option>
          <option value="200">200</option>
          <option value="250">250</option>
          <option value="500">500</option>
        </select>
        {combineRemainderInput}
      </span>
    )
  },

  getGroupReducerOption() {
    if (!this.props.groupings || !this.props.groupings.length) return null
    const value = this.props.groupReducer ? this.props.groupReducer.name : ""

    return (
      <select onChange={this.onGroupReducerChange} value={value}>
        <option value="">Reduce by</option>
        <option value="getLength">Length</option>
        <option value="getPercentage">Percentage</option>
      </select>
    )
  },

  render() {
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
            {this.getGroupReducerOption()}
            {this.getSortAndLimitOptions()}
          </div>
        </div>
      </div>
    )
  },
})

module.exports = GroupingControl
