const React = require("react")
const R = require("ramda")

const formatter = require("./formatter")
const Filters = require("./filters")

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

  onAddFilter: function(e) {
    this.props.actionCreator.addFilter(e.target.value)
  },

  onGroupByChange: function(e) {
    this.props.actionCreator.groupBy(e.target.value)
  },

  onSortByChange: function(e) {
    this.props.actionCreator.sortBy(e.target.value)
  },

  onSortDirectionChange: function(e) {
    this.props.actionCreator.sortDirection(e.target.value)
  },

  onReset: function() {
    this.props.actionCreator.reset()
  },

  onBackClick: function() {
    this.props.actionCreator.goBack()
  },

  getFilterOptions: function() {
    const filterOptions = R.pipe(
      R.keys,
      R.without(R.pluck("name", this.props.filters))
    )(this.props.schema)

    return filterOptions.map(function(value) {
      return (
        <option value={value} key={value}>{value}</option>
      )
    })
  },

  getFilterControl: function() {
    return (
      <div className="input-control">
        <span>Add Filter:</span>
        <select onChange={this.onAddFilter}>
          <option></option>
          {this.getFilterOptions()}
        </select>
      </div>
    )
  },

  getGroupAndSortByOptions: function() {
    return Object.keys(this.props.schema).map(function(value) {
      return (
        <option value={value} key={value}>{value}</option>
      )
    })
  },

  getGroupByControl: function() {
    return (
      <div className="input-control">
        <span>Group By:</span>
        <select onChange={this.onGroupByChange} value={this.props.groupBy || ""}>
          <option></option>
          {this.getGroupAndSortByOptions()}
        </select>
      </div>
    )
  },

  getSortByControl: function() {
    return (
      <div className="input-control">
        <span>Sort By:</span>
        <select onChange={this.onSortByChange} value={this.props.sortBy || ""}>
          <option></option>
          {this.getGroupAndSortByOptions()}
        </select>
        <select onChange={this.onSortDirectionChange} value={this.props.sortDirection}>
          <option value="asc">ASC</option>
          <option value="desc">DESC</option>
        </select>
      </div>
    )
  },

  getResetControl: function() {
    return (
      <p><a className="site-link" onClick={this.onReset}>Reset</a></p>
    )
  },

  showSummary: function(filtered, grouped) {
    const groupBreakdown = "None"
    const formattedGroups = null

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

  getLimitText: function(filtered) {
    return (
      <div>
        <p>NOTE: results display limited to {FILTER_THRESHOLD}</p>
        <p>To download the whole lot <a className="site-link" onClick={this.downloadResults.bind(this, filtered)}>click here</a></p>
      </div>
    )
  },

  showResults: function(filtered, grouped) {
    const dataToDisplay = grouped || filtered
    const resultsText = (<p><a className="site-link" onClick={this.downloadResults.bind(this, dataToDisplay)}>Download as JSON</a></p>)

    if (filtered.length > FILTER_THRESHOLD) {
      dataToDisplay = R.take(FILTER_THRESHOLD, filtered)
      if (grouped) dataToDisplay = formatter.group(dataToDisplay, this.props.groupBy)
      resultsText = this.getLimitText(filtered)
    }

    return (
      <div>
        <h3>Results</h3>
        {resultsText}
        <pre>{JSON.stringify(dataToDisplay, null, 2)}</pre>
        <a id="hidden-download-link" style={{display: "none"}}></a>
      </div>
    )
  },

  render: function() {
    window.scrollTo(0, 0)

    const filtered = formatter.filter(this.props.data, this.props.schema, this.props.filters)
    const grouped = null

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
        {this.getFilterControl()}
        {this.getGroupByControl()}
        {this.getSortByControl()}
        {this.getResetControl()}
        {this.showSummary(filtered, grouped)}
        {this.showResults(filtered, grouped)}
      </div>
    )
  },
})

module.exports = Display
