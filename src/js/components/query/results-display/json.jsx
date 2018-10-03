const React = require("react")
const PropTypes = require("prop-types")
const CopyToClipboard = require("react-copy-to-clipboard").CopyToClipboard

const Code = require("../../shared/code")

function JsonDisplay(props) {

  function onDownload() {
    props.onDownload(props.raw)
  }

  const downloadLinks = []

  if (props.showToast) {
    downloadLinks.push(
      (
        <li key="copy"><a className="site-link">
          <CopyToClipboard text={props.formatted} onCopy={props.showToast}>
            <span>Copy To Clipboard</span>
          </CopyToClipboard></a>
        </li>
      )
    )
  }

  downloadLinks.push(
    (
      <li key="download"><a className="site-link" onClick={onDownload}>Download</a></li>
    )
  )

  return (
    <div>
      <ul className="side-options right">{downloadLinks}</ul>
      <div>
        <Code language="json">
          {props.formatted}
        </Code>
      </div>
    </div>
  )
}

JsonDisplay.propTypes = {
  formatted: PropTypes.any.isRequired,
  raw: PropTypes.any.isRequired,
  onDownload: PropTypes.func.isRequired,
  showToast: PropTypes.func,
}

module.exports = JsonDisplay
