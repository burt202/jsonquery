const React = require("react")
const ReactDOM = require("react-dom")

const actionCreator = require("./action-creator")
const store = require("./store")
const Upload = require("./upload")
const Display = require("./display")

require("../css/app.css")

const Main = React.createClass({
  getInitialState: function() {
    return store.getState()
  },

  componentDidMount: function() {
    store.addChangeListener(this.update)
  },

  componentWillUnmount: function() {
    store.removeChangeListener(this.update)
  },

  update: function() {
    this.setState(store.getState())
  },

  render: function() {
    if (!this.state.schema || !this.state.data || !this.state.resultFields) {
      return <Upload
        actionCreator={actionCreator}
      />
    }

    return <Display
      actionCreator={actionCreator}
      filters={this.state.filters}
      groupBy={this.state.groupBy}
      sortBy={this.state.sortBy}
      sortDirection={this.state.sortDirection}
      schema={this.state.schema}
      data={this.state.data}
      resultFields={this.state.resultFields}
      showCounts={this.state.showCounts}
      limit={this.state.limit}
      sum={this.state.sum}
      average={this.state.average}
    />
  },
})

ReactDOM.render(<Main />, document.body.querySelector(".main"))
