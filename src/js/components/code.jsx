const React = require("react")
const PropTypes = require("prop-types")

const SLH = require("react-syntax-highlighter/dist/light")
const SyntaxHighlighter = SLH.default
const language = require("react-syntax-highlighter/dist/languages/json").default
const resultsStyle = require("react-syntax-highlighter/dist/styles/github").default
SLH.registerLanguage("json", language)

function Code(props) {
  return (<SyntaxHighlighter language={props.language} style={resultsStyle}>
    {props.children}
  </SyntaxHighlighter>)
}

Code.propTypes = {
  children: PropTypes.node.isRequired,
  language: PropTypes.oneOf(["json"]),
}

module.exports = Code
