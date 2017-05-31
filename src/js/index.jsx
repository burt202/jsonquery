/* global VERSION */

require("normalize.css")

const injectTapEventPlugin = require("react-tap-event-plugin")
injectTapEventPlugin()

const {default: MuiThemeProvider} = require("material-ui/styles/MuiThemeProvider")

const React = require("react")
const ReactDOM = require("react-dom")
const Main = require("./main")

function app(Main) {
  return (<MuiThemeProvider>
    <Main version={VERSION}/>
  </MuiThemeProvider>)
}

ReactDOM.render(
  app(Main),
  document.body.querySelector(".main")
)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept("./main", function() {
    const AppContainer = require("react-hot-loader").AppContainer
    const Main = require("./main")

    ReactDOM.render(
      <AppContainer>
        {app(Main)}
      </AppContainer>,
      document.body.querySelector(".container")
    )
  })
}
