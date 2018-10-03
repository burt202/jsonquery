const React = require("react")
const PropTypes = require("prop-types")
const CopyToClipboard = require("react-copy-to-clipboard").CopyToClipboard

const Code = require("../../shared/code")

function JsonDisplay(props) {

  function onDownload() {
    props.onDownload()
  }

  const downloadLink = props.onDownload ? (<ul className="side-options right">
    <li><a className="site-link">
      <CopyToClipboard text={props.data} onCopy={props.onCopy}>
        <span>Copy To Clipboard</span>
      </CopyToClipboard></a>
    </li>
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
  onCopy: PropTypes.func,
}

module.exports = JsonDisplay
