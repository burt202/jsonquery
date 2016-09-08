var React = require("react");
var ReactDOM = require("react-dom");

var actionCreator = require("./js/action-creator");
var store = require("./js/store");
var Upload = require("./js/upload");
var Display = require("./js/display");

require("./css/app.css");

var Main = React.createClass({
  getInitialState: function () {
    return store.getState();
  },

  componentDidMount: function () {
    store.addChangeListener(this.update);
  },

  componentWillUnmount: function () {
    store.removeChangeListener(this.update);
  },

  update: function () {
    this.setState(store.getState());
  },

  render: function () {
    if (!this.state.schema || !this.state.data) {
      return <Upload
        actionCreator={actionCreator}
      />
    } else {
      return <Display
        actionCreator={actionCreator}
        filters={this.state.filters}
        groupBy={this.state.groupBy}
        sortBy={this.state.sortBy}
        sortDirection={this.state.sortDirection}
        schema={this.state.schema}
        data={this.state.data}
      />
    }
  }
});

ReactDOM.render(<Main />, document.body.querySelector(".main"));
