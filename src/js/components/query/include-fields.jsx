const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")

const R = require("ramda")

const IncludeFields = createReactClass({
  displayName: "IncludeFields",

  propTypes: {
    groupings: PropTypes.array,
    resultFields: PropTypes.array.isRequired,
    schema: PropTypes.object.isRequired,
    actionCreator: PropTypes.object.isRequired,
    groupReducer: PropTypes.object,
    analyse: PropTypes.string,
  },

  isAggregateResult() {
    return this.props.groupReducer || this.props.analyse
  },

  onChangeHandler(e) {
    const field = e.target.name
    const isPresent = R.contains(field, this.props.resultFields)
    const updatedFields = (isPresent) ?
      R.without([field], this.props.resultFields) :
      R.append(field, this.props.resultFields)

    this.props.actionCreator.updateResultFields(updatedFields)
  },

  getResultFieldOptions() {
    const schemaKeys = R.sortBy(R.identity, R.keys(this.props.schema))

    return schemaKeys.map(function(field) {
      const checked = R.contains(field, this.props.resultFields)
      const disabled = R.contains(field, this.props.groupings)

      return (
        <label className="checkbox-label" key={field}>
          <input type="checkbox" name={field} disabled={disabled} checked={checked} onChange={this.onChangeHandler} />
          {field}
        </label>
      )
    }.bind(this))
  },

  unSelectResultFields() {
    this.props.actionCreator.updateResultFields(this.props.groupings)
  },

  selectResultFields() {
    this.props.actionCreator.updateResultFields(R.keys(this.props.schema))
  },

  render() {
    if (this.isAggregateResult()) return null

    return (
      <div className="include-fields-cont">
        <h3>Include</h3>
        <div>
          <span>{this.getResultFieldOptions()}</span>
          <p>
            <a className="site-link" style={{marginRight: "15px"}} onClick={this.unSelectResultFields}>Unselect All</a>
            <a className="site-link" onClick={this.selectResultFields}>Select All</a>
          </p>
        </div>
      </div>
    )
  },
})

module.exports = IncludeFields
