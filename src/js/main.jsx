const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")
const queryString = require("query-string")

const store = require("./store/index")
const actionCreator = require("./store/action-creator")(store)

const Home = require("./home")
const FromUrl = require("./from-url")
const Query = require("./query")

require("../css/app.css")

const Main = createReactClass({
  displayName: "Main",

  propTypes: {
    version: PropTypes.string.isRequired,
  },

  componentDidMount() {
    this.unsubscribe = store.subscribe(this.update)
  },

  componentWillUnmount() {
    this.unsubscribe()
  },

  update() {
    this.forceUpdate()
  },

  getContent() {
    const state = store.getState()

    if (!state.schema || !state.data || !state.resultFields) {
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
      filters={state.filters}
      groupings={state.groupings}
      sorters={state.sorters}
      schema={state.schema}
      data={state.data}
      calculatedFields={state.calculatedFields}
      calculationsString={state.calculationsString}
      resultFields={state.resultFields}
      showCounts={state.showCounts}
      groupSort={state.groupSort}
      groupLimit={state.groupLimit}
      limit={state.limit}
      analyse={state.analyse}
      combineRemainder={state.combineRemainder}
    />
  },

  getToast() {
    const state = store.getState()

    if (state.toast) {
      return (
        <div className="toast-outer">
          <div className="toast-inner">{state.toast}</div>
        </div>
      )
    }

    return undefined
  },

  render() {
    return (
      <div>
        <div className="header">
          <h1><a href="/">JSONQuery</a></h1>
          <span>v{this.props.version} - <a className="site-link" href="https://github.com/burt202/jsonquery">Github</a></span>
        </div>
        {this.getToast()}
        {this.getContent()}
      </div>
    )
  },
})

module.exports = Main
