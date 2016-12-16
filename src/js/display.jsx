const React = require("react")
const R = require("ramda")

const formatter = require("./formatter")
const Filters = require("./filters")
const Controls = require("./controls")

const FILTER_THRESHOLD = 500

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
  },

  onBackClick: function() {
    this.props.actionCreator.goBack()
  },

  showSummary: function(filtered, grouped) {
    var groupBreakdown = "None"
    var formattedGroups = null

    if (grouped) {
      formattedGroups = R.pipe(
        R.toPairs,
        R.map(function(pair) {
          return {name: pair[0], total: pair[1].length}
        }),
        R.sortBy(R.prop("total")),
        R.reverse,
        R.map(function(group) {
          return group.name + " (" + group.total + ")"
        }),
        R.join(", ")
      )(grouped)

      groupBreakdown = R.pipe(
        R.toPairs,
        R.map(R.last),
        R.map(function(obj) {
          return obj.name + ": " + obj.value
        }),
        R.join(", ")
      )(formatter.getGroupStats(grouped))
    }

    return (
      <div>
        <h3>Summary</h3>
        <p>Total: {filtered.length}</p>
        <p><u><strong>Groups</strong></u></p>
        <p>{groupBreakdown}</p>
        <p>{formattedGroups}</p>
      </div>
    )
  },

  downloadResults: function(data) {
    const dataStr = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], {type: "application/json"}))
    const downloadLink = document.getElementById("hidden-download-link")
    downloadLink.setAttribute("href", dataStr)
    downloadLink.setAttribute("download", new Date().toISOString() + ".json")
    downloadLink.click()
    downloadLink.setAttribute("href", "")
  },

  getLimitText: function() {
    return (<p>NOTE: results display limited to {FILTER_THRESHOLD}</p>)
  },

  getDownloadText: function(text, data) {
    return (<p>{text}: <a className="site-link" onClick={this.downloadResults.bind(this, data)}>JSON</a></p>)
  },

  showResults: function(filtered, grouped) {
    var dataToDisplay = grouped || filtered
    var limitText = null
    var downloadText = this.getDownloadText("Download as", dataToDisplay)

    if (filtered.length > FILTER_THRESHOLD) {
      dataToDisplay = R.take(FILTER_THRESHOLD, filtered)
      if (grouped) dataToDisplay = formatter.group(dataToDisplay, this.props.groupBy)
      limitText = this.getLimitText()
      downloadText = this.getDownloadText("Download the whole lot as", filtered)
    }

    return (
      <div>
        <h3>Results</h3>
        {limitText}
        {downloadText}
        <pre>{JSON.stringify(dataToDisplay, null, 2)}</pre>
        <a id="hidden-download-link" style={{display: "none"}}></a>
      </div>
    )
  },

  render: function() {
    window.scrollTo(0, 0)

    var filtered = formatter.filter(this.props.data, this.props.schema, this.props.filters)
    var grouped = null

    if (this.props.groupBy) {
      grouped = formatter.group(filtered, this.props.groupBy)
    }

    if (this.props.sortBy) {
      filtered = formatter.sort(filtered, this.props.sortBy, this.props.sortDirection)
    }

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
        {this.showSummary(filtered, grouped)}
        {this.showResults(filtered, grouped)}
      </div>
    )
  },
})

module.exports = Display
