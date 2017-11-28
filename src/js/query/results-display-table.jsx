const React = require("react")
const PropTypes = require("prop-types")
const Clipboard = require("clipboard")

const R = require("ramda")

function TableDisplay(props) {
  new Clipboard("th.tableHeaderCell")

  function onDownload() {
    props.onDownload()
  }

  function getHeaderCopyText(index) {
    return R.pipe(
      R.reject(R.propEq("type", "header")),
      R.map(R.compose(R.prop(index), R.prop("cols"))),
      R.join(",")
    )(props.data)
  }

  const header = R.find(R.propEq("type", "header"), props.data)

  let tableHeader = null

  if (header) {
    const headerRow = header.cols.map(function(col, index) {
      return <th key={index} className="tableHeaderCell" data-clipboard-text={getHeaderCopyText(index)} title="Copy column data">{col}</th>
    })

    tableHeader = <thead><tr>{headerRow}</tr></thead>
  }

  const dataRows = R.reject(R.propEq("type", "header"), props.data)

  const tableBodyRows = dataRows.map(function(row, index) {
    if (row.type === "title") {
      return (
        <tr key={index}>
          <td colSpan={row.span} style={{fontWeight: "bold"}}>{row.cols[0]}</td>
        </tr>
      )
    }

    const cols = row.cols.map(function(col, index) {
      if (typeof col === "boolean") col = col.toString()
      return <td key={index}>{col}</td>
    })

    return <tr key={index}>{cols}</tr>
  })

  const downloadLink = props.onDownload ? (<ul className="side-options right">
    <li><a className="site-link" onClick={onDownload}>Download</a></li>
  </ul>) : null

  return (
    <div>
      {downloadLink}
      <table className="table">
        {tableHeader}
        <tbody>
          {tableBodyRows}
        </tbody>
      </table>
    </div>
  )
}

TableDisplay.propTypes = {
  data: PropTypes.any.isRequired,
  onDownload: PropTypes.func,
}

module.exports = TableDisplay
