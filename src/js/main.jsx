const React = require("react")
const PropTypes = require("prop-types")
const queryString = require("query-string")

const actionCreator = require("./store/action-creator")
const store = require("./store/index")

const Home = require("./home")
const FromUrl = require("./from-url")
const Query = require("./query")

require("../css/app.css")

const Main = React.createClass({
  displayName: "Main",

  propTypes: {
    version: PropTypes.string.isRequired,
  },

  getInitialState() {
    return store.getState()
  },

  componentDidMount() {
    store.addChangeListener(this.update)
  },

  componentWillUnmount() {
    store.removeChangeListener(this.update)
  },

  update() {
    this.setState(store.getState())
  },

  getContent() {
    if (!this.state.schema || !this.state.data || !this.state.resultFields) {
      const parsed = queryString.parse(location.search)

      if (parsed.dataUrl) {
        return <FromUrl
          actionCreator={actionCreator}
          params={parsed}
        />
      }

      return <Home
        actionCreator={actionCreator}
      />
    }

    return <Query
      actionCreator={actionCreator}
      filters={this.state.filters}
      groupings={this.state.groupings}
      sorters={this.state.sorters}
      schema={this.state.schema}
      data={this.state.data}
      calculatedFields={this.state.calculatedFields}
      calculationsString={this.state.calculationsString}
      resultFields={this.state.resultFields}
      showCounts={this.state.showCounts}
      groupSort={this.state.groupSort}
      groupLimit={this.state.groupLimit}
      limit={this.state.limit}
      analyse={this.state.analyse}
      combineRemainder={this.state.combineRemainder}
    />
  },

  render() {
    return (
      <div>
        <div className="header">
          <h1><a href="/">JSONQuery</a></h1>
          <span>v{this.props.version} - <a className="site-link" href="https://github.com/burt202/jsonquery">Github</a></span>
        </div>
        {this.getContent()}
      </div>
    )
  },
})

module.exports = Main
