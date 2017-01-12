const React = require("react")

const formatter = require("../helpers/formatter")

const Filters = require("./filters")
const Controls = require("./controls")
const Summary = require("./summary")
const Results = require("./results")

const Display = React.createClass({
  displayName: "Display",

  propTypes: {
    actionCreator: React.PropTypes.object.isRequired,
    filters: React.PropTypes.array.isRequired,
    groupBy: React.PropTypes.string,
    sortBy: React.PropTypes.string,
    sortDirection: React.PropTypes.string,
    schema: React.PropTypes.object.isRequired,
    data: React.PropTypes.array.isRequired,
    resultFields: React.PropTypes.array.isRequired,
  },

  onBackClick: function() {
    this.props.actionCreator.goBack()
  },

  render: function() {
    window.scrollTo(0, 0)

    var results = formatter.filter(this.props.data, this.props.schema, this.props.filters)

    return (
      <div>
        <p><a className="site-link" onClick={this.onBackClick}>Go back</a></p>
        <Filters
          actionCreator={this.props.actionCreator}
          filters={this.props.filters}
          schema={this.props.schema}
        />
        <Controls
          actionCreator={this.props.actionCreator}
          filters={this.props.filters}
          schema={this.props.schema}
          groupBy={this.props.groupBy}
          sortBy={this.props.sortBy}
          sortDirection={this.props.sortDirection}
        />
        <Summary
          results={results}
          groupBy={this.props.groupBy}
        />
        <Results
          results={results}
          groupBy={this.props.groupBy}
          sortBy={this.props.sortBy}
          sortDirection={this.props.sortDirection}
          resultFields={this.props.resultFields}
          schema={this.props.schema}
          actionCreator={this.props.actionCreator}
        />
      </div>
    )
  },
})

module.exports = Display
