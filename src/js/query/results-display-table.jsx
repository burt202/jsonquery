const React = require("react")
const PropTypes = require("prop-types")

const R = require("ramda")

function TableDisplay(props) {
  const header = R.find(R.propEq("type", "header"), props.data)

  let tableHeader = null

  if (header) {
    const headerRow = header.cols.map(function(col, index) {
      return <th key={index}>{col}</th>
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

  return (
    <table className="table">
      {tableHeader}
      <tbody>
        {tableBodyRows}
      </tbody>
    </table>
  )
}

TableDisplay.propTypes = {
  data: PropTypes.any.isRequired,
}

module.exports = TableDisplay
