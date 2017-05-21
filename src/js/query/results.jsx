const React = require("react")
const PropTypes = require("prop-types")
const R = require("ramda")
const Clipboard = require("clipboard")

const Inset = require("../components/inset")

const {default: Menu, MenuItem} = require("material-ui/menu")
const {default: Popover} = require("material-ui/Popover")
const {default: RaisedButton} = require("material-ui/RaisedButton")
const {default: Subheader} = require("material-ui/Subheader")
const {default: Chip} = require("material-ui/Chip")

const {default: DownloadIcon} = require("material-ui/svg-icons/file/file-download")

const downloadFormatter = require("../services/download-formatter")
const Code = require("../components/code")

const DISPLAY_THRESHOLD = 1000

const Results = React.createClass({
  displayName: "Results",

  propTypes: {
    results: PropTypes.any.isRequired,
    groupings: PropTypes.array,
    resultFields: PropTypes.array.isRequired,
    schema: PropTypes.object.isRequired,
    actionCreator: PropTypes.object.isRequired,
    showCounts: PropTypes.bool.isRequired,
    filteredLength: PropTypes.number.isRequired,
    analyse: PropTypes.string,
  },

  getInitialState() {
    return {
      type: "json",
    }
  },

  setType(type) {
    this.setState({type})
  },

  downloadOpened(event) {
    event.preventDefault()

    this.setState({
      downloadOpen: true,
      anchorEl: event.currentTarget,
    })
  },

  downloadClosed() {
    this.setState({
      downloadOpen: false,
    })
  },

  downloadResults(type) {
    const formatted = downloadFormatter[this.state.type](this.props.groupings, this.props.showCounts, this.props.results)

    const dataStr = URL.createObjectURL(new Blob([formatted], {type: type.mimetype}))
    const downloadLink = document.getElementById("hidden-download-link")
    downloadLink.setAttribute("href", dataStr)
    downloadLink.setAttribute("download", `${new Date().toISOString()}.${type.extension}`)
    downloadLink.click()
    downloadLink.setAttribute("href", "")
  },

  isAggregateResult() {
    return this.props.showCounts || this.props.analyse
  },

  tooManyResultToShow() {
    return this.props.filteredLength > DISPLAY_THRESHOLD
  },

  getDisplayData() {
    if (!this.isAggregateResult() && this.tooManyResultToShow())
      return "Results set too large to display, use download options instead"
    return downloadFormatter[this.state.type](this.props.groupings, this.props.showCounts, this.props.results)
  },

  onChangeHandler(field) {
    const isPresent = R.contains(field, this.props.resultFields)
    const updatedFields = (isPresent) ?
      R.without([field], this.props.resultFields) :
      R.append(field, this.props.resultFields)

    this.props.actionCreator.updateResultFields(updatedFields)
  },

  getDownloadLinks() {
    const sumedOrAveraged = !!(this.props.analyse)

    const jsonFormatter = downloadFormatter.json(this.props.groupings, this.props.showCounts, sumedOrAveraged)
    const csvFormatter = downloadFormatter.csv(this.props.groupings, this.props.showCounts, sumedOrAveraged)

    const types = [
      {name: "JSON", mimetype: "application/json", extension: "json", formatter: jsonFormatter},
      {name: "CSV", mimetype: "text/csv", extension: "csv", formatter: csvFormatter},
    ]

    const links = types.map(function(type) {
      const downloader = this.downloadResults.bind(this, type)
      return (<MenuItem key={type.name} onTouchTap={downloader} primaryText={type.name}/>)
    }.bind(this))

    return <div>
      <RaisedButton secondary
        label="Download"
        labelPosition="before"
        onTouchTap={this.downloadOpened}
        icon={<DownloadIcon/>}
      />
      <Popover
        open={this.state.downloadOpen}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{horizontal: "left", vertical: "bottom"}}
        targetOrigin={{horizontal: "left", vertical: "top"}}
        onRequestClose={this.downloadClosed}
      >
        <Menu width={128}>{links}</Menu>
      </Popover>
    </div>
  },

  getResultFieldOptions() {
    const schemaKeys = R.sortBy(R.identity, R.keys(this.props.schema))

    return schemaKeys.map(function(field) {
      const checked = R.contains(field, this.props.resultFields)
      const toggleable = !R.contains(field, this.props.groupings)

      return <FieldToggle
        key={field}
        label={field}
        value={checked}
        onToggle={toggleable ? this.onChangeHandler.bind(null, field) : undefined}
      />
    }.bind(this))
  },

  getCheckboxes() {
    return (!this.isAggregateResult()) ? <div style={{display: "flex", flexWrap: "wrap"}}>
      {this.getResultFieldOptions()}
    </div> : null
  },

  canCopyResults() {
    return this.props.showCounts || !this.tooManyResultToShow()
  },

  getCopyLink() {
    return (this.canCopyResults()) ? <a className="site-link" data-clipboard-action="copy" data-clipboard-target="#copy-cont">Copy to clipboard</a> : null
  },

  render() {
    new Clipboard("a[data-clipboard-action='copy']")

    return (
      <div>
        <Subheader>Results</Subheader>
        <Inset vertical={false}>
          {this.getCheckboxes()}
          {this.getDownloadLinks()}
        </Inset>
        <Inset>
          {this.getCopyLink()}
          <div id="copy-cont">
            <Code language="json">
              {this.getDisplayData()}
            </Code>
          </div>
        </Inset>
        <a id="hidden-download-link" style={{display: "none"}}></a>
      </div>
    )
  },
})

const style = {marginRight: 8, marginBottom: 8}
function FieldToggle({label, value, onToggle}) {
  return <Chip onTouchTap={onToggle} style={Object.assign({}, style, {
    opacity: value ? 1 : 0.5,
  })}>{label}</Chip>
}

FieldToggle.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.bool.isRequired,
  onToggle: PropTypes.func,
}

module.exports = Results
