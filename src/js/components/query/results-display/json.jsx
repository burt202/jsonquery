const React = require("react")
const PropTypes = require("prop-types")

const Code = require("../../shared/code")

function JsonDisplay(props) {
  function onDownload() {
    props.onDownload(props.downloadFormat)
  }

  const downloadLinks = []

  if (props.showToast) {
    downloadLinks.push(
      <li key="copy">
        <a className="site-link">
          <span
            onClick={() => {
              navigator.clipboard.writeText(props.formatted).then(() => props.showToast())
            }}
          >
            Copy To Clipboard
          </span>
        </a>
      </li>,
    )
  }

  downloadLinks.push(
    <li key="download">
      <a className="site-link" onClick={onDownload}>
        Download
      </a>
    </li>,
  )

  return (
    <div>
      <ul className="side-options right">{downloadLinks}</ul>
      <div>
        <Code language="json">
          {props.resultFields.length === 0 ? "No columns selected" : props.formatted}
        </Code>
      </div>
    </div>
  )
}

JsonDisplay.propTypes = {
  formatted: PropTypes.any.isRequired,
  downloadFormat: PropTypes.any.isRequired,
  onDownload: PropTypes.func.isRequired,
  resultFields: PropTypes.array.isRequired,
  showToast: PropTypes.func,
}

module.exports = JsonDisplay
