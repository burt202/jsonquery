const React = require("react")
const useState = React.useState
const PropTypes = require("prop-types")

const validator = require("../../services/validator")
const schemaGenerator = require("../../services/schema-generator")

const Paste = require("./paste")
const Upload = require("./upload")
const Url = require("./url")

const {Tabs, Typography} = require("antd")
const {Title, Text} = Typography
const {TabPane} = Tabs

const testData = require("../../../test-data.json")

function Home(props) {
  const [state, setState] = useState({
    selectedTab: "1",
    errorDate: null,
  })

  const showError = message => {
    setState({...state, errorDate: Date.now()})
    alert(message)
  }

  const selectTab = tab => {
    setState({
      ...state,
      selectedTab: tab,
    })
  }

  const onAction = json => {
    if (!validator.isValidJSON(json)) {
      showError("Not valid JSON!")
      return
    }

    json = JSON.parse(json)

    if (!validator.isArray(json)) {
      showError("Data must be an array")
      return
    }

    if (!json.length) {
      showError("Data must have at least 1 item")
      return
    }

    props.actionCreator.saveJson("data", json)
    props.actionCreator.saveJson("schema", schemaGenerator.generate(json[0]))
  }

  return (
    <div className="home-cont">
      <div style={{marginTop: 16, marginBottom: 32}}>
        <Title level={4}>Online JSON Querying Tool. Query your JSON with ease.</Title>
        <Text>
          Takes a JSON array and allows you to add multiple filters, groupings and sorting to
          manipulate the data in many ways. Use the inputs below to supply your data. We do not do
          anything with your data!
        </Text>
      </div>
      <Tabs onChange={selectTab} activeKey={state.selectedTab}>
        <TabPane tab="By Pasting" key="1">
          <Paste onAction={onAction} data={testData} />
        </TabPane>
        <TabPane tab="By Upload" key="2">
          <Upload onAction={onAction} errorDate={state.errorDate} />
        </TabPane>
        <TabPane tab="By Url" key="3">
          <Url />
        </TabPane>
      </Tabs>
    </div>
  )
}

Home.propTypes = {
  actionCreator: PropTypes.object.isRequired,
}

module.exports = Home
