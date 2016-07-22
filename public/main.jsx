var React = require("react");
var ReactDOM = require("react-dom");

var Main = React.createClass({
  render: function () {
    return (
      <div>here</div>
    )
  }
});

ReactDOM.render(<Main />, document.body.querySelector(".main"));
