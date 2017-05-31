const React = require("react")
const Code = require("../components/code")

const SpaceAfter = require("../components/space-after")

const {CardText} = require("material-ui/Card")
const {default: Divider} = require("material-ui/Divider")
const {default: RaisedButton} = require("material-ui/RaisedButton")

const testSchema = {
  Album: "string",
  Artist: "string",
  Genre: "string",
  Length: "number",
  Size: "string",
  Title: "string",
  Track: "number",
  Year: "date",
}

const wordWrap = {
  whiteSpace: "normal",
  wordWrap: "break-word",
  wordBreak: "break-all",
}

const testUrl = "/?dataUrl=http://jsonquery.co.uk/test-data.json"
const testUrlWithSchema = `/?dataUrl=http://jsonquery.co.uk/test-data.json&schema=${encodeURIComponent(JSON.stringify(testSchema))}`

const Url = React.createClass({
  displayName: "Url",

  goTo(url) {
    window.location = url
  },

  render() {
    return (
      <div>
        <CardText style={wordWrap}>
          <p>You can also load in data via the url. Use the <code>dataUrl</code> parameter and point it to the url where your data is located. The data must be in JSON format and depending on the size of the data set, it may take a long time to load in.</p>
          <SpaceAfter><Code inline>{testUrl}</Code></SpaceAfter>
          <RaisedButton secondary onTouchTap={this.goTo.bind(this, testUrl)} label="Try it out"/>
        </CardText>

        <Divider/>

        <CardText style={wordWrap}>
          <p>If you wanted to override the automatic schema generation you can also supply a schema using the <code>schema</code> parameter. This parameter must be URL encoded.</p>
          <SpaceAfter><Code inline>{testUrlWithSchema}</Code></SpaceAfter>
          <RaisedButton secondary onTouchTap={this.goTo.bind(this, testUrlWithSchema)} label="Try it out"/>
        </CardText>
      </div>
    )
  },
})

module.exports = Url
