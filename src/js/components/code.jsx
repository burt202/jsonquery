const React = require("react")

const SLH = require("react-syntax-highlighter/dist/light")
const SyntaxHighlighter = SLH.default
const {registerLanguage} = SLH
const language = require("react-syntax-highlighter/dist/languages/json").default
const resultsStyle = require("react-syntax-highlighter/dist/styles/github").default
registerLanguage("json", language)

function Code(props) {
  return (<SyntaxHighlighter language={props.language} style={resultsStyle}>
    {props.children}
  </SyntaxHighlighter>)
}

Code.propTypes = {
  children: React.PropTypes.node.isRequired,
  language: React.PropTypes.oneOf(["json"]),
}


module.exports = Code
