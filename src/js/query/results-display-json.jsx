const React = require("react")
const PropTypes = require("prop-types")
const Clipboard = require("clipboard")

const Code = require("../components/code")

function JsonDisplay(props) {
  new Clipboard("a.site-link[data-clipboard-action='copy']")

  return (
    <div className="json-display">
      <a className="site-link" data-clipboard-action="copy" data-clipboard-target="#copy-cont">Copy To Clipboard</a>
      <div id="copy-cont">
        <Code language="json">
          {props.data}
        </Code>
      </div>
    </div>
  )
}

JsonDisplay.propTypes = {
  data: PropTypes.any.isRequired,
}

module.exports = JsonDisplay
