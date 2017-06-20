const React = require("react")
const PropTypes = require("prop-types")

const Filters = require("./filters")
const Controls = require("./controls")
const Results = require("./results")
const SchemaEdit = require("./schema-edit")

const Query = React.createClass({
  displayName: "Query",

  propTypes: {
    actionCreator: PropTypes.object.isRequired,
    filters: PropTypes.array.isRequired,
    groupings: PropTypes.array,
    sorters: PropTypes.array,
    schema: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    resultFields: PropTypes.array.isRequired,
    showCounts: PropTypes.bool.isRequired,
    flatten: PropTypes.bool.isRequired,
    groupSort: PropTypes.string.isRequired,
    groupLimit: PropTypes.number,
    limit: PropTypes.number,
    analyse: PropTypes.string,
  },

  getInitialState() {
    return {
      showSchemaControls: false,
    }
  },

  onReset() {
    this.props.actionCreator.reset()
  },

  onSchemaEdit() {
    this.setState({showSchemaControls: true})
  },

  getSideOptions() {
    return (
      <ul className="side-options right">
        <li><a className="site-link" onClick={this.onSchemaEdit}>Edit Schema</a></li>
        <li><a className="site-link" onClick={this.onReset}>Reset</a></li>
      </ul>
    )
  },

  onCancel() {
    this.setState({showSchemaControls: false})
  },

  onSave(schema) {
    this.setState({showSchemaControls: false})
    this.props.actionCreator.saveJson("schema", schema)
  },

  getSchemaControls() {
    return (
      <SchemaEdit
        schema={this.props.schema}
        onSave={this.onSave}
        onCancel={this.onCancel}
      />
    )
  },

  render() {
    if (this.state.showSchemaControls) return this.getSchemaControls()

    return (
      <div className="query-cont">
        {this.getSideOptions()}
        <Filters
          actionCreator={this.props.actionCreator}
          filters={this.props.filters}
          schema={this.props.schema}
        />
        <Controls
          actionCreator={this.props.actionCreator}
          schema={this.props.schema}
          groupings={this.props.groupings}
          sorters={this.props.sorters}
          showCounts={this.props.showCounts}
          flatten={this.props.flatten}
          groupSort={this.props.groupSort}
          groupLimit={this.props.groupLimit}
          limit={this.props.limit}
          analyse={this.props.analyse}
        />
        <Results
          data={this.props.data}
          flatten={this.props.flatten}
          filters={this.props.filters}
          sorters={this.props.sorters}
          limit={this.props.limit}
          groupings={this.props.groupings}
          resultFields={this.props.resultFields}
          schema={this.props.schema}
          actionCreator={this.props.actionCreator}
          showCounts={this.props.showCounts}
          analyse={this.props.analyse}
          groupSort={this.props.groupSort}
          groupLimit={this.props.groupLimit}
        />
      </div>
    )
  },
})

module.exports = Query
