const React = require("react")
const PropTypes = require("prop-types")
const queryString = require("query-string")

const actionCreator = require("./store/action-creator")
const store = require("./store/index")

const Home = require("./home")
const FromUrl = require("./from-url")
const Query = require("./query")

const AppBar = require("material-ui/AppBar").default
const FlatButton = require("material-ui/FlatButton").default


require("../css/app.css")

const Main = React.createClass({
  displayName: "Main",

  propTypes: {
    version: PropTypes.string,
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
      resultFields={this.state.resultFields}
      showCounts={this.state.showCounts}
      limit={this.state.limit}
      analyse={this.state.analyse}
    />
  },

  render() {
    return (<div>
      <AppBar
        title = {<span>JSONQuery <span style={{fontSize: 12}}>v{this.props.version}</span></span>}
        iconElementRight = {<FlatButton href="https://github.com/burt202/jsonquery" label="Github" />}
        showMenuIconButton = {false}
      />
      {this.getContent()}
    </div>)
  },
})

module.exports = Main
