const React = require("react")
const useState = React.useState
const PropTypes = require("prop-types")
const classNames = require("classnames")

const R = require("ramda")

const downloadFormatter = require("../../../services/download-formatter")
const validator = require("../../../services/validator")
const dataProcessor = require("../../../services/data-processor")

const JsonDisplay = require("./json")
const TableDisplay = require("./table")
const ChartDisplay = require("./chart")

const getDownloaders = require("./downloaders")
const Code = require("../../shared/code")

const DISPLAY_THRESHOLD = 1000

function Results(props) {
  const [state, setState] = useState({
    type: "json",
  })

  const setType = type => {
    setState({type})
  }

  const getViewTypes = () => {
    const downloaders = getDownloaders()

    return {
      json: {
        name: "JSON",
        extension: "json",
        downloader: downloaders.base("json", "application/json"),
        component: JsonDisplay,
      },
      table: {
        name: "Table",
        extension: "csv",
        downloader: downloaders.base("csv", "text/csv"),
        component: TableDisplay,
      },
      chart: {
        name: "Chart (BETA)",
        extension: "png",
        downloader: downloaders.chart("png", "image/png"),
        component: ChartDisplay,
      },
    }
  }

  const getViewTypesLinks = () => {
    return R.toPairs(getViewTypes()).map(function(pair) {
      const classnames = classNames({
        active: state.type === pair[0],
      })

      return (
        <li key={pair[0]} className={classnames}>
          <a className="site-link" onClick={() => setType(pair[0])}>
            {pair[1].name}
          </a>
        </li>
      )
    })
  }

  const showToast = () => {
    const actionCreator = props.actionCreator

    actionCreator.showToast("Copied!")

    setTimeout(function() {
      actionCreator.removeToast()
    }, 3000)
  }

  const isAggregateResult = () => {
    return props.groupReducer || props.analyse
  }

  const tooManyResultToShow = () => {
    return props.filteredLength > DISPLAY_THRESHOLD
  }

  const getDisplayData = results => {
    const viewTypes = getViewTypes()
    const type = viewTypes[state.type]

    if (validator.isString(results)) return <Code language="json">{results}</Code>

    if (state.type === "chart" && (!props.groupings.length || !props.groupReducer)) {
      return (
        <Code language="json">
          You must select a grouping with a reducer to use the charts display
        </Code>
      )
    }

    if (state.type === "chart" && props.groupings.length > 1) {
      return (
        <Code language="json">
          Currently only one level of grouping is supported in the charts display
        </Code>
      )
    }

    const downloadFormat = downloadFormatter[type.extension]
      ? downloadFormatter[type.extension](props.groupings, props.groupReducer, results)
      : results

    if (!isAggregateResult() && tooManyResultToShow()) {
      return (
        <JsonDisplay
          formatted={`Results set too large to display, use download link for .${type.extension} file`}
          downloadFormat={downloadFormat}
          onDownload={viewTypes[state.type].downloader}
        />
      )
    }

    const formatted = downloadFormatter[state.type]
      ? downloadFormatter[state.type](props.groupings, props.groupReducer, results)
      : results

    const Component = type.component
    return (
      <Component
        formatted={formatted}
        downloadFormat={downloadFormat}
        onDownload={type.downloader}
        showToast={showToast}
        resultFields={props.resultFields}
      />
    )
  }

  const formatData = data => {
    if (props.groupings.length) {
      const grouped = dataProcessor.group(props.groupings, data)
      return props.groupReducer
        ? dataProcessor.groupProcessor(
            props.schema,
            props.groupReducer,
            props.groupSort,
            props.groupLimit,
            props.combineRemainder,
            grouped,
          )
        : grouped
    }

    if (props.analyse)
      return dataProcessor.analyse(props.schema[props.analyse], props.analyse, data)

    return data
  }

  const results = formatData(props.filtered)

  return (
    <div className="results-cont">
      <h3>Results</h3>
      <div className="results-options">
        <ul className="side-options">{getViewTypesLinks()}</ul>
      </div>
      {getDisplayData(results)}
      <a id="hidden-download-link" style={{display: "none"}}></a>
    </div>
  )
}

Results.propTypes = {
  filtered: PropTypes.array.isRequired,
  filteredLength: PropTypes.number.isRequired,
  groupings: PropTypes.array,
  resultFields: PropTypes.array.isRequired,
  schema: PropTypes.object.isRequired,
  actionCreator: PropTypes.object.isRequired,
  groupReducer: PropTypes.object,
  analyse: PropTypes.string,
  groupSort: PropTypes.string.isRequired,
  groupLimit: PropTypes.number,
  combineRemainder: PropTypes.bool.isRequired,
}

module.exports = Results
