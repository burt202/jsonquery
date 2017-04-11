const React = require("react")

const SortingControl = React.createClass({
  displayName: "SortingControl",

  propTypes: {
    sorters: React.PropTypes.array,
    options: React.PropTypes.array.isRequired,
    onAdd: React.PropTypes.func.isRequired,
    onRemove: React.PropTypes.func.isRequired,
  },

  getInitialState: function() {
    return {
      field: null,
      direction: null,
    }
  },

  onChange: function(prop, e) {
    const toSet = {}
    toSet[prop] = e.target.value

    this.setState(toSet, function() {
      if (this.state.field !== null && this.state.direction !== null) {
        this.props.onAdd(this.state)
        this.setState(this.getInitialState())
      }
    }.bind(this))
  },

  getRows: function() {
    return this.props.sorters.map(function(sorter) {
      return (
        <div className="row" key={sorter.field}>
          <div className="sorter">
            {sorter.field} - {sorter.direction.toUpperCase()}
            <a className="site-link" onClick={this.props.onRemove.bind(this, sorter.field)}>remove</a>
          </div>
        </div>
      )
    }.bind(this))
  },

  render: function() {
    const options = this.props.options.map(function(value) {
      return (
        <option value={value} key={value}>{value}</option>
      )
    })

    return (
      <div className="input-control">
        <label>Sort By:</label>
        <div className="body">
          {this.getRows()}
          <div className="row">
            <select onChange={this.onChange.bind(this, "field")} value={this.state.field || ""}>
              <option></option>
              {options}
            </select>
            <select onChange={this.onChange.bind(this, "direction")} value={this.state.direction || ""}>
              <option></option>
              <option value="asc">ASC</option>
              <option value="desc">DESC</option>
            </select>
          </div>
        </div>
      </div>
    )
  },
})

module.exports = SortingControl
