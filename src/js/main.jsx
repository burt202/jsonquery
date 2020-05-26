const React = require("react")
const useEffect = React.useEffect
const useState = React.useState
const PropTypes = require("prop-types")

const queryString = require("query-string")

const store = require("./store/index")
const actionCreator = require("./store/action-creator")(store)

const Home = require("./components/home")
const FromUrl = require("./components/from-url")
const Query = require("./components/query")

const {Typography, message} = require("antd")
const {Title} = Typography

require("../css/app.css")
require("antd/dist/antd.css")

function Main(props) {
  const [state, setState] = useState(store.getState())

  useEffect(() => {
    const unsubscribe = store.subscribe(() => setState(store.getState()))

    return () => {
      unsubscribe()
    }
  }, [])

  const getContent = () => {
    if (!state.schema || !state.data || !state.resultFields) {
      const parsed = queryString.parse(location.search)

      if (parsed.dataUrl) {
        return <FromUrl actionCreator={actionCreator} params={parsed} />
      }

      return <Home actionCreator={actionCreator} />
    }

    return (
      <Query
        actionCreator={actionCreator}
        filters={state.filters}
        groupings={state.groupings}
        sorters={state.sorters}
        schema={state.schema}
        data={state.data}
        calculatedFields={state.calculatedFields}
        calculationsString={state.calculationsString}
        resultFields={state.resultFields}
        groupReducer={state.groupReducer}
        groupSort={state.groupSort}
        groupLimit={state.groupLimit}
        limit={state.limit}
        analyse={state.analyse}
        combineRemainder={state.combineRemainder}
      />
    )
  }

  const getToast = () => {
    if (state.toast) {
      message.success(state.toast)
    }

    return undefined
  }

  return (
    <div>
      <div className="header">
        <Title style={{marginTop: 16}}>
          <a href="/">JSONQuery</a>
        </Title>
        <span>
          v{props.version} -{" "}
          <a className="site-link" href="https://github.com/burt202/jsonquery">
            Github
          </a>
        </span>
      </div>
      {getToast()}
      {getContent()}
    </div>
  )
}

Main.propTypes = {
  version: PropTypes.string.isRequired,
}

module.exports = Main
