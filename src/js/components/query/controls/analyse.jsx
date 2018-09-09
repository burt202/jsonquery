const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")
const R = require("ramda")

const AnalyseControl = createReactClass({
  displayName: "AnalyseControl",

  propTypes: {
    value: PropTypes.string,
    schema: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  },

  onChange(e) {
    this.props.onChange(e.target.value)
  },

  getNumberOptions() {
    const numberOptions = R.pipe(
      R.toPairs,
      R.filter(R.compose(R.equals("number"), R.prop(1))),
      R.map(R.prop(0))
    )(this.props.schema)

    return numberOptions.map(function(value) {
      return (
        <option value={value} key={value}>{value}</option>
      )
    })
  },

  render() {
    return (
      <div className="input-control">
        <label>Analyse:</label>
        <div className="body">
          <div className="row">
            <select onChange={this.onChange} value={this.props.value || ""}>
              <option></option>
              {this.getNumberOptions()}
            </select>
          </div>
        </div>
      </div>
    )
  },
})

module.exports = AnalyseControl
