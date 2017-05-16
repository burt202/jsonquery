const React = require("react")

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

const testUrl = "/?dataUrl=http://jsonquery.co.uk/test-data.json"
const testUrlWithSchema = "/?dataUrl=http://jsonquery.co.uk/test-data.json&schema=" + encodeURIComponent(JSON.stringify(testSchema))

const Url = React.createClass({
  displayName: "Url",

  goTo: function(url) {
    window.location = url
  },

  render: function() {
    return (
      <div>
        <p>You can also load in data via the url. Use the <code>dataUrl</code> parameter and point it to the url where your data is located. The data must be in JSON format and depending on the size of the data set, it may take a long time to load in.</p>
        <pre>{testUrl}</pre>
        <p><button onClick={this.goTo.bind(this, testUrl)}>Try it out</button></p>
        <p>If you wanted to override the automatic schema generation you can also supply a schema using the <code>schema</code> parameter. This parameter must be URL encoded.</p>
        <pre>{testUrlWithSchema}</pre>
        <p><button onClick={this.goTo.bind(this, testUrlWithSchema)}>Try it out</button></p>
      </div>
    )
  },
})

module.exports = Url
