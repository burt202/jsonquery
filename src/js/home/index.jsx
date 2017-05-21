const React = require("react")
const PropTypes = require("prop-types")

const validator = require("../services/validator")
const schemaGenerator = require("../services/schema-generator")

const {CardText, CardTitle} = require("material-ui/Card")
const {default: Tabs, Tab} = require("material-ui/Tabs")

const Layout = require("../components/layout")

const Paste = require("./paste")
const Upload = require("./upload")
const Url = require("./url")

const Home = React.createClass({
  displayName: "Home",

  propTypes: {
    actionCreator: PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      selectedTab: "paste",
      errorDate: null,
    }
  },

  showError(message) {
    this.setState({"errorDate": Date.now()})
    alert(message)
  },

  selectTab(tab) {
    this.setState({
      selectedTab: tab,
    })
  },

  onAction(json) {
    if (!validator.isValidJSON(json)) {
      this.showError("Not valid JSON!")
      return
    }

    json = JSON.parse(json)

    if (!validator.isArray(json)) {
      this.showError("Data must be an array")
      return
    }

    if (!json.length) {
      this.showError("Data must have at least 1 item")
      return
    }

    this.props.actionCreator.saveJson("data", json)
    this.props.actionCreator.saveJson("schema", schemaGenerator.generate(json[0]))
  },

  render() {
    return (<Layout
      left = {<div>
        <CardTitle
          title="Online JSON Querying Tool"
          subtitle="Query your JSON with ease"
        />
        <CardText>
          <p>Takes a JSON array and allows you to add multiple filters, groupings and sorting to manipulate the data in many ways.</p>
          <p>Use the inputs on the right to supply your data.</p>
          <p>We do not do anything with your data!</p>
        </CardText>
      </div>}

      right = {
        <Tabs>
          <Tab label="From clipboard">
            <Paste onAction={this.onAction} />
          </Tab>
          <Tab label="From file">
            <Upload onAction={this.onAction} errorDate={this.state.errorDate} />
          </Tab>
          <Tab label="From URL">
            <Url/>
          </Tab>
        </Tabs>
      }
    />)
  },
})

module.exports = Home
