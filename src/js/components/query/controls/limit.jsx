const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")

const LimitControl = createReactClass({
  displayName: "LimitControl",

  propTypes: {
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
  },

  onChange(e) {
    this.props.onChange(parseInt(e.target.value, 10))
  },

  render() {
    return (
      <div className="input-control">
        <label>Limit:</label>
        <div className="body">
          <div className="row">
            <select onChange={this.onChange} value={this.props.value || ""}>
              <option>Show all</option>
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
          </div>
        </div>
      </div>
    )
  },
})

module.exports = LimitControl
