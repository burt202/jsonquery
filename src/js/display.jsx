var React = require("react");
var R = require("ramda");

var formatter = require("./formatter");
var Filters = require("./filters");

var FILTER_THRESHOLD = 500;

var round = R.curry(function (decimals, num) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
});

function max (arr) {
  return Math.max.apply(null, arr);
}

function min (arr) {
  return Math.min.apply(null, arr);
}

function getMode (arr) {
  return arr.reduce(function(current, item) {
    var val = current.numMapping[item] = (current.numMapping[item] || 0) + 1;
    if (val > current.greatestFreq) {
      current.greatestFreq = val;
      current.mode = item;
    }
    return current;
  }, {mode: null, greatestFreq: -Infinity, numMapping: {}}, arr).mode;
}

var Display = React.createClass({
  displayName: "Display",

  propTypes: {
    actionCreator: React.PropTypes.object.isRequired,
    filters: React.PropTypes.array.isRequired,
    groupBy: React.PropTypes.string,
    schema: React.PropTypes.object.isRequired,
    data: React.PropTypes.array.isRequired
  },

  onAddFilter: function (e) {
    this.props.actionCreator.addFilter(e.target.value);
  },

  onGroupByChange: function (e) {
    this.props.actionCreator.groupBy(e.target.value);
  },

  onReset: function () {
    this.props.actionCreator.reset();
  },

  onBackClick: function () {
    this.props.actionCreator.goBack();
  },

  getFilterOptions: function () {
    var filterOptions = R.pipe(
      R.keys,
      R.without(R.pluck("name", this.props.filters))
    )(this.props.schema);

    return filterOptions.map(function (value) {
      return (
        <option value={value} key={value}>{value}</option>
      );
    });
  },

  getFilterControl: function () {
    return (
      <div className="input-control">
        <span>Add Filter:</span>
        <select onChange={this.onAddFilter}>
          <option></option>
          {this.getFilterOptions()}
        </select>
      </div>
    );
  },

  getGroupByOptions: function () {
    return Object.keys(this.props.schema).map(function (value) {
      return (
        <option value={value} key={value}>{value}</option>
      );
    });
  },

  getGroupByControl: function () {
    return (
      <div className="input-control">
        <span>Group By:</span>
        <select onChange={this.onGroupByChange} value={this.props.groupBy || ""}>
          <option></option>
          {this.getGroupByOptions()}
        </select>
      </div>
    );
  },

  getResetControl: function () {
    return (
      <p><a className="site-link" onClick={this.onReset}>Reset</a></p>
    );
  },

  showSummary: function (filtered, grouped) {
    var groupBreakdown = "None";
    var formattedGroups = null;

    if (grouped) {
      formattedGroups = R.pipe(
        R.toPairs,
        R.map(function (pair) {
          return {name: pair[0], total: pair[1].length}
        }),
        R.sortBy(R.prop("total")),
        R.reverse,
        R.map(function (group) {
          return group.name + " (" + group.total + ")";
        }),
        R.join(", ")
      )(grouped);

      var groupLengths = R.pipe(
        R.toPairs,
        R.map(function (pair) {
          return pair[1].length;
        })
      )(grouped);

      var count = {name: "Count", value: Object.keys(grouped).length};
      var highest = {name: "Max Size", value: max(groupLengths)};
      var lowest = {name: "Min Size", value: min(groupLengths)};
      var mean = {name: "Mean Size", value: R.compose(round(2), R.mean)(groupLengths)};
      var median = {name: "Median Size", value: R.compose(round(2), R.median)(groupLengths)};
      var mode = {name: "Mode Size", value: getMode(groupLengths)};

      var stats = [count];
      if (count.value) stats = stats.concat([highest, lowest, mean, median, mode]);

      groupBreakdown = R.pipe(
        R.map(function (obj) {
          return obj.name + ": " + obj.value
        }),
        R.join(", ")
      )(stats);
    }

    return (
      <div>
        <h3>Summary</h3>
        <p>Total: {filtered.length}</p>
        <p><u><strong>Groups</strong></u></p>
        <p>{groupBreakdown}</p>
        <p>{formattedGroups}</p>
      </div>
    );
  },

  downloadResults: function (data) {
    var dataStr = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], {type: "application/json"}));
    var downloadLink = document.getElementById("hidden-download-link");
    downloadLink.setAttribute("href", dataStr);
    downloadLink.setAttribute("download", new Date().toISOString() + ".json");
    downloadLink.click();
    downloadLink.setAttribute("href", "");
  },

  getLimitText: function (filtered) {
    return (
      <div>
        <p>NOTE: results display limited to {FILTER_THRESHOLD}</p>
        <p>To download the whole lot <a className="site-link" onClick={this.downloadResults.bind(this, filtered)}>click here</a></p>
      </div>
    );
  },

  showResults: function (filtered, grouped) {
    var dataToDisplay = grouped || filtered;
    var resultsText = (<p><a className="site-link" onClick={this.downloadResults.bind(this, dataToDisplay)}>Download as JSON</a></p>);

    if (filtered.length > FILTER_THRESHOLD) {
      dataToDisplay = R.take(FILTER_THRESHOLD, filtered);
      if (grouped) dataToDisplay = formatter.group(dataToDisplay, this.props.groupBy)
      resultsText = this.getLimitText(filtered);
    }

    return (
      <div>
        <h3>Results</h3>
        {resultsText}
        <pre>{JSON.stringify(dataToDisplay, null, 2)}</pre>
        <a id="hidden-download-link" style={{display: "none"}}></a>
      </div>
    );
  },

  render: function () {
    window.scrollTo(0, 0);

    var filtered = formatter.filter(this.props.data, this.props.schema, this.props.filters);
    var grouped = null;

    if (this.props.groupBy) {
      grouped = formatter.group(filtered, this.props.groupBy);
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
        {this.getResetControl()}
        {this.showSummary(filtered, grouped)}
        {this.showResults(filtered, grouped)}
      </div>
    )
  }
});

module.exports = Display;
