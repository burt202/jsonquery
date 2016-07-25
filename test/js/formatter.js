var chai = require("chai");
var expect = chai.expect;

var formatter = require("../../src/js/formatter");

var data = [
  {type: "cash", name: "foo"},
  {type: "cash", name: "bar"},
  {type: "loan", name: "baz"}
];

describe("formatter", function () {

  describe("group", function () {
    it("should group data if groupBy argument is passed", function () {
      expect(formatter.group(data, "type")).to.eql({
        "cash": [
          {
            "name": "foo",
            "type": "cash"
          },
          {
            "name": "bar",
            "type": "cash"
          }
        ],
        "loan": [
          {
            "name": "baz",
            "type": "loan"
          }
        ]
       });
    });

    it("should do nothing if no groupBy argument is passed", function () {
      expect(formatter.group(data)).to.eql(data);
    });
  });
});
