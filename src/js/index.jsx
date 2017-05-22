/* global VERSION */

const React = require("react")
const ReactDOM = require("react-dom")
const Main = require("./main")

ReactDOM.render(
  <Main version={VERSION} />,
  document.body.querySelector(".container")
)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept("./main", function() {
    const AppContainer = require("react-hot-loader").AppContainer
    const Main = require("./main")

    ReactDOM.render(
      <AppContainer>
        <Main version={VERSION} />
      </AppContainer>,
      document.body.querySelector(".container")
    )
  })
}
