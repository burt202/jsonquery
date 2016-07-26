var chai = require("chai");
var expect = chai.expect;

var formatter = require("../../src/js/formatter");

var mockDataForFiltering = [
  {type: "cash", name: "foo", code: 101, deleted: true},
  {type: "cash", name: "bar", code: 102, deleted: false},
  {type: "loan", name: "baz", code: 103}
];

var mockDataForGrouping = [
  {type: "cash", name: "foo"},
  {type: "cash", name: "bar"},
  {type: "loan", name: "baz"}
];

var mockSchema = {
  type: "string",
  code: "int",
  deleted: "bool"
};

describe("formatter", function () {

  describe("filter", function () {
    it("should not filter anything if no filters are defined", function () {
      var res = formatter.filter(mockDataForFiltering, mockSchema, []);

      expect(res).to.eql(mockDataForFiltering);
    });

    it("should filter on a 'string' field", function () {
      var res = formatter.filter(mockDataForFiltering, mockSchema, [
        {name: "type", value: "cash"}
      ]);

      expect(res).to.eql([
        {type: "cash", name: "foo", code: 101, deleted: true},
        {type: "cash", name: "bar", code: 102, deleted: false},
      ]);
    });

    it("should filter on a 'int' field", function () {
      var res = formatter.filter(mockDataForFiltering, mockSchema, [
        {name: "code", value: 102}
      ]);

      expect(res).to.eql([
        {type: "cash", name: "bar", code: 102, deleted: false}
      ]);
    });

    it("should filter on a 'bool' field when true", function () {
      var res = formatter.filter(mockDataForFiltering, mockSchema, [
        {name: "deleted", value: "true"}
      ]);

      expect(res).to.eql([
        {type: "cash", name: "foo", code: 101, deleted: true}
      ]);
    });

    it("should filter on a 'bool' field when false", function () {
      var res = formatter.filter(mockDataForFiltering, mockSchema, [
        {name: "deleted", value: "false"}
      ]);

      expect(res).to.eql([
        {type: "cash", name: "bar", code: 102, deleted: false}
      ]);
    });

    it("should filter on a 'bool' field when null", function () {
      var res = formatter.filter(mockDataForFiltering, mockSchema, [
        {name: "deleted", value: ""}
      ]);

      expect(res).to.eql([
        {type: "loan", name: "baz", code: 103}
      ]);
    });

    it("should filter on multiple fields", function () {
      var res = formatter.filter(mockDataForFiltering, mockSchema, [
        {name: "type", value: "cash"},
        {name: "deleted", value: "false"}
      ]);

      expect(res).to.eql([
        {type: "cash", name: "bar", code: 102, deleted: false}
      ]);
    });
  });

  describe("group", function () {
    it("should group data if groupBy argument is passed", function () {
      expect(formatter.group(mockDataForGrouping, "type")).to.eql({
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
  });
});
