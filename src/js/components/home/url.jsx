const React = require("react")
const useState = React.useState

const {Typography, Input, Button, Checkbox} = require("antd")
const {Text} = Typography
const {TextArea} = Input

const schemaGenerator = require("../../services/schema-generator")

const testData = require("../../../test-data.json")
const testSchema = schemaGenerator.generate(testData[0])

const testUrl = "https://jsonquery.co.uk/test-data.json"

function Url() {
  const [state, setState] = useState({
    url: testUrl,
    schema: JSON.stringify(testSchema, null, 2),
    checked: false,
  })

  const onUrlChange = e => {
    setState({
      ...state,
      url: e.target.value,
      schema: "",
    })
  }

  const onSchemaChange = e => {
    setState({
      ...state,
      schema: e.target.value,
    })
  }

  const onCheckboxChange = () => {
    setState({
      ...state,
      checked: !state.checked,
    })
  }

  const onGo = () => {
    if (!state.url) {
      alert("You must supply a url")
      return
    }

    const url = encodeURIComponent(state.url)
    const schema = state.schema.length ? `&schema=${encodeURIComponent(state.schema)}` : ""
    const withCredentials = state.checked ? "&withCredentials" : ""
    window.location = `?dataUrl=${url}${schema}${withCredentials}`
  }

  return (
    <div>
      <div style={{marginBottom: 16}}>
        <Text>
          The url must point to a valid JSON file and depending on the size of the data set, it may
          take a long time to load in.
        </Text>
      </div>
      <div style={{marginBottom: 8}}>
        <Input type="text" className="url" value={state.url} onChange={onUrlChange} />
      </div>
      <div style={{marginBottom: 16}}>
        <Checkbox name="withCredentials" checked={state.checked} onChange={onCheckboxChange}>
          Send cookies with request
        </Checkbox>
      </div>
      <div style={{marginBottom: 16}}>
        <Text>
          If you wanted to override the automatic schema generation you can also supply your own
          schema, but this is optional. The schema must be valid JSON and gets URL encoded when
          turned into a URL parameter.
        </Text>
      </div>
      <div style={{marginBottom: 8}}>
        <TextArea value={state.schema} onChange={onSchemaChange} rows={10} />
      </div>
      <Button type="primary" onClick={onGo}>
        Go
      </Button>
    </div>
  )
}

module.exports = Url
