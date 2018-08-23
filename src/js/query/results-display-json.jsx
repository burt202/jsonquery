const React = require("react")
const PropTypes = require("prop-types")
const ClipboardJS = require("clipboard")

const Code = require("../components/code")

function JsonDisplay(props) {
  new ClipboardJS("a.site-link[data-clipboard-action='copy']")

  function onDownload() {
    props.onDownload()
  }

  const downloadLink = props.onDownload ? (<ul className="side-options right">
    <li><a className="site-link" data-clipboard-action="copy" data-clipboard-target="#copy-cont">Copy To Clipboard</a></li>
    <li><a className="site-link" onClick={onDownload}>Download</a></li>
  </ul>) : null

  return (
    <div>
      {downloadLink}
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
  onDownload: PropTypes.func,
}

module.exports = JsonDisplay
