var chai = require("chai");
var expect = chai.expect;

var formatter = require("../../src/js/formatter");

var mockDataForFiltering = [
  {name: "foo", type: "cash", code: 101, deleted: true},
  {name: "bar", type: "cash", code: 102, deleted: false},
  {name: "baz", type: "loan", code: 103, deleted: null},
  {name: "abc", type: null, code: 103, deleted: true},
  {name: "123", type: "card", code: null, deleted: false}
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

    it("should filter on a 'string' field when operator is 'eq'", function () {
      var res = formatter.filter(mockDataForFiltering, mockSchema, [
        {name: "type", value: "cash", operator: "eq"}
      ]);

      expect(res).to.eql([
        {type: "cash", name: "foo", code: 101, deleted: true},
        {type: "cash", name: "bar", code: 102, deleted: false}
      ]);
    });

    it("should filter on a 'string' field when operator is 'neq'", function () {
      var res = formatter.filter(mockDataForFiltering, mockSchema, [
        {name: "type", value: "cash", operator: "neq"}
      ]);

      expect(res).to.eql([
        {type: "loan", name: "baz", code: 103, deleted: null},
        {type: null, name: "abc", code: 103, deleted: true},
        {name: "123", type: "card", code: null, deleted: false}
      ]);
    });

    it("should filter on a 'string' field when operator is 'nl'", function () {
      var res = formatter.filter(mockDataForFiltering, mockSchema, [
        {name: "type", operator: "nl"}
      ]);

      expect(res).to.eql([
        {type: null, name: "abc", code: 103, deleted: true}
      ]);
    });

    it("should filter on a 'int' field when operator is 'eq'", function () {
      var res = formatter.filter(mockDataForFiltering, mockSchema, [
        {name: "code", value: 102, operator: "eq"}
      ]);

      expect(res).to.eql([
        {type: "cash", name: "bar", code: 102, deleted: false}
      ]);
    });

    it("should filter on a 'int' field when operator is 'neq'", function () {
      var res = formatter.filter(mockDataForFiltering, mockSchema, [
        {name: "code", value: 102, operator: "neq"}
      ]);

      expect(res).to.eql([
        {type: "cash", name: "foo", code: 101, deleted: true},
        {type: "loan", name: "baz", code: 103, deleted: null},
        {type: null, name: "abc", code: 103, deleted: true},
        {name: "123", type: "card", code: null, deleted: false}
      ]);
    });

    it("should filter on a 'int' field when operator is 'nl'", function () {
      var res = formatter.filter(mockDataForFiltering, mockSchema, [
        {name: "code", operator: "nl"}
      ]);

      expect(res).to.eql([
        {name: "123", type: "card", code: null, deleted: false}
      ]);
    });

    it("should filter on a 'bool' field when true", function () {
      var res = formatter.filter(mockDataForFiltering, mockSchema, [
        {name: "deleted", value: "true"}
      ]);

      expect(res).to.eql([
        {type: "cash", name: "foo", code: 101, deleted: true},
        {type: null, name: "abc", code: 103, deleted: true}
      ]);
    });

    it("should filter on a 'bool' field when false", function () {
      var res = formatter.filter(mockDataForFiltering, mockSchema, [
        {name: "deleted", value: "false"}
      ]);

      expect(res).to.eql([
        {type: "cash", name: "bar", code: 102, deleted: false},
        {name: "123", type: "card", code: null, deleted: false}
      ]);
    });

    it("should filter on a 'bool' field when null", function () {
      var res = formatter.filter(mockDataForFiltering, mockSchema, [
        {name: "deleted", value: ""}
      ]);

      expect(res).to.eql([
        {type: "loan", name: "baz", code: 103, deleted: null}
      ]);
    });

    it("should filter on multiple fields", function () {
      var res = formatter.filter(mockDataForFiltering, mockSchema, [
        {name: "type", value: "cash", operator: "eq"},
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
