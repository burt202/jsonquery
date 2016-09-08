var chai = require("chai");
var expect = chai.expect;

var formatter = require("../../src/js/formatter");

var mockDataForFiltering = [
  {name: "foo", type: "cash", code: 101, deleted: true, dateCreated: "2016-07-11T17:16:27"},
  {name: "bar", type: "cash", code: 102, deleted: false, dateCreated: "2016-08-11T17:16:27"},
  {name: "baz", type: "loan", code: 103, deleted: null, dateCreated: "2016-06-11T17:16:27"},
  {name: "abc", type: null, code: 103, deleted: true, dateCreated: null},
  {name: "123", type: "card", code: null, deleted: false, dateCreated: "2016-07-11T17:16:27"}
];

var mockDataForGrouping = [
  {name: "foo", type: "cash"},
  {name: "bar", type: "cash"},
  {name: "baz", type: "loan"}
];

var mockDataForSorting = [
  {name: "foo", num: 2},
  {name: "bar", num: 1},
  {name: "baz", num: 3}
];

var mockSchema = {
  type: "string",
  code: "int",
  deleted: "bool",
  dateCreated: "date"
};

describe("formatter", function () {

  describe("filter", function () {
    it("should not filter anything if no filters are defined", function () {
      var res = formatter.filter(mockDataForFiltering, mockSchema, []);

      expect(res).to.eql(mockDataForFiltering);
    });

    it("should filter on multiple fields", function () {
      var res = formatter.filter(mockDataForFiltering, mockSchema, [
        {name: "type", value: "cash", operator: "eq"},
        {name: "deleted", value: "false"}
      ]);

      expect(res).to.eql([
        {type: "cash", name: "bar", code: 102, deleted: false, dateCreated: "2016-08-11T17:16:27"}
      ]);
    });

    describe("string", function () {

      it("should filter when operator is 'eq'", function () {
        var res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "type", value: "cash", operator: "eq"}
        ]);

        expect(res).to.eql([
          {type: "cash", name: "foo", code: 101, deleted: true, dateCreated: "2016-07-11T17:16:27"},
          {type: "cash", name: "bar", code: 102, deleted: false, dateCreated: "2016-08-11T17:16:27"}
        ]);
      });

      it("should filter when operator is 'neq'", function () {
        var res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "type", value: "cash", operator: "neq"}
        ]);

        expect(res).to.eql([
          {type: "loan", name: "baz", code: 103, deleted: null, dateCreated: "2016-06-11T17:16:27"},
          {type: null, name: "abc", code: 103, deleted: true, dateCreated: null},
          {name: "123", type: "card", code: null, deleted: false, dateCreated: "2016-07-11T17:16:27"}
        ]);
      });

      it("should filter when operator is 'nl'", function () {
        var res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "type", operator: "nl"}
        ]);

        expect(res).to.eql([
          {type: null, name: "abc", code: 103, deleted: true, dateCreated: null}
        ]);
      });

      it("should filter when operator is 'iof'", function () {
        var res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "type", value: "cash,loan", operator: "iof"}
        ]);

        expect(res).to.eql([
          {name: "foo", type: "cash", code: 101, deleted: true, dateCreated: "2016-07-11T17:16:27"},
          {name: "bar", type: "cash", code: 102, deleted: false, dateCreated: "2016-08-11T17:16:27"},
          {name: "baz", type: "loan", code: 103, deleted: null, dateCreated: "2016-06-11T17:16:27"}
        ]);
      });
    });

    describe("int", function () {

      it("should filter when operator is 'eq'", function () {
        var res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", value: 102, operator: "eq"}
        ]);

        expect(res).to.eql([
          {type: "cash", name: "bar", code: 102, deleted: false, dateCreated: "2016-08-11T17:16:27"}
        ]);
      });

      it("should filter when operator is 'neq'", function () {
        var res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", value: 102, operator: "neq"}
        ]);

        expect(res).to.eql([
          {type: "cash", name: "foo", code: 101, deleted: true, dateCreated: "2016-07-11T17:16:27"},
          {type: "loan", name: "baz", code: 103, deleted: null, dateCreated: "2016-06-11T17:16:27"},
          {type: null, name: "abc", code: 103, deleted: true, dateCreated: null},
          {name: "123", type: "card", code: null, deleted: false, dateCreated: "2016-07-11T17:16:27"}
        ]);
      });

      it("should filter when operator is 'nl'", function () {
        var res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "nl"}
        ]);

        expect(res).to.eql([
          {name: "123", type: "card", code: null, deleted: false, dateCreated: "2016-07-11T17:16:27"}
        ]);
      });

      it("should filter when operator is 'gt'", function () {
        var res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", value: 102, operator: "gt"}
        ]);

        expect(res).to.eql([
          {name: "baz", type: "loan", code: 103, deleted: null, dateCreated: "2016-06-11T17:16:27"},
          {name: "abc", type: null, code: 103, deleted: true, dateCreated: null}
        ]);
      });

      it("should filter when operator is 'lt'", function () {
        var res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", value: 102, operator: "lt"}
        ]);

        expect(res).to.eql([
          {name: "foo", type: "cash", code: 101, deleted: true, dateCreated: "2016-07-11T17:16:27"},
          {name: "123", type: "card", code: null, deleted: false, dateCreated: "2016-07-11T17:16:27"}
        ]);
      });

      it("should filter when operator is 'gte'", function () {
        var res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", value: 102, operator: "gte"}
        ]);

        expect(res).to.eql([
          {type: "cash", name: "bar", code: 102, deleted: false, dateCreated: "2016-08-11T17:16:27"},
          {name: "baz", type: "loan", code: 103, deleted: null, dateCreated: "2016-06-11T17:16:27"},
          {name: "abc", type: null, code: 103, deleted: true, dateCreated: null}
        ]);
      });

      it("should filter when operator is 'lte'", function () {
        var res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", value: 102, operator: "lte"}
        ]);

        expect(res).to.eql([
          {name: "foo", type: "cash", code: 101, deleted: true, dateCreated: "2016-07-11T17:16:27"},
          {type: "cash", name: "bar", code: 102, deleted: false, dateCreated: "2016-08-11T17:16:27"},
          {name: "123", type: "card", code: null, deleted: false, dateCreated: "2016-07-11T17:16:27"}
        ]);
      });

      it("should filter when operator is 'iof'", function () {
        var res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", value: "101,103", operator: "iof"}
        ]);

        expect(res).to.eql([
          {name: "foo", type: "cash", code: 101, deleted: true, dateCreated: "2016-07-11T17:16:27"},
          {name: "baz", type: "loan", code: 103, deleted: null, dateCreated: "2016-06-11T17:16:27"},
          {name: "abc", type: null, code: 103, deleted: true, dateCreated: null}
        ]);
      });
    });

    describe("bool", function () {

      it("should filter when true", function () {
        var res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "deleted", value: "true"}
        ]);

        expect(res).to.eql([
          {type: "cash", name: "foo", code: 101, deleted: true, dateCreated: "2016-07-11T17:16:27"},
          {type: null, name: "abc", code: 103, deleted: true, dateCreated: null}
        ]);
      });

      it("should filter when false", function () {
        var res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "deleted", value: "false"}
        ]);

        expect(res).to.eql([
          {type: "cash", name: "bar", code: 102, deleted: false, dateCreated: "2016-08-11T17:16:27"},
          {name: "123", type: "card", code: null, deleted: false, dateCreated: "2016-07-11T17:16:27"}
        ]);
      });

      it("should filter when null", function () {
        var res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "deleted", value: ""}
        ]);

        expect(res).to.eql([
          {type: "loan", name: "baz", code: 103, deleted: null, dateCreated: "2016-06-11T17:16:27"}
        ]);
      });
    });

    describe("date", function () {
      it("should filter when operator is 'nl'", function () {
        var res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "nl", value: ""}
        ]);

        expect(res).to.eql([
          {type: null, name: "abc", code: 103, deleted: true, dateCreated: null}
        ]);
      });

      it("should filter when operator is 'eq'", function () {
        var res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "eq", value: "20160611"}
        ]);

        expect(res).to.eql([
          {type: "loan", name: "baz", code: 103, deleted: null, dateCreated: "2016-06-11T17:16:27"}
        ]);
      });

      it("should filter when operator is 'be'", function () {
        var res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "be", value: "20160811"}
        ]);

        expect(res).to.eql([
          {name: "foo", type: "cash", code: 101, deleted: true, dateCreated: "2016-07-11T17:16:27"},
          {name: "baz", type: "loan", code: 103, deleted: null, dateCreated: "2016-06-11T17:16:27"},
          {name: "123", type: "card", code: null, deleted: false, dateCreated: "2016-07-11T17:16:27"}
        ]);
      });

      it("should filter when operator is 'at'", function () {
        var res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "at", value: "20160712"}
        ]);

        expect(res).to.eql([
          {type: "cash", name: "bar", code: 102, deleted: false, dateCreated: "2016-08-11T17:16:27"}
        ]);
      });
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

  describe("sort", function () {
    it("should sort the data in ascending order", function () {
      expect(formatter.sort(mockDataForSorting, "num", "asc")).to.eql([
        {name: "bar", num: 1},
        {name: "foo", num: 2},
        {name: "baz", num: 3}
      ]);
    });

    it("should sort the data in descending order", function () {
      expect(formatter.sort(mockDataForSorting, "num", "desc")).to.eql([
        {name: "baz", num: 3},
        {name: "foo", num: 2},
        {name: "bar", num: 1}
      ]);
    });
  });

  describe("getGroupStats", function () {
    it("should return the total number of groups", function () {
      var res = formatter.getGroupStats({foo: [], bar: []});

      expect(res.count).to.eql({name: "Count", value: 2});
    });

    it("should return the size of the biggest group", function () {
      var res = formatter.getGroupStats({foo: [1, 2, 3], bar: [1]});

      expect(res.max).to.eql({name: "Max Size", value: 3});
    });

    it("should return the size of the smallest group", function () {
      var res = formatter.getGroupStats({foo: [1, 2, 3], bar: [1]});

      expect(res.min).to.eql({name: "Min Size", value: 1});
    });

    it("should return the mean average group size", function () {
      var res = formatter.getGroupStats({foo: [1, 2, 3], bar: [1]});

      expect(res.mean).to.eql({name: "Mean Size", value: 2});
    });

    it("should return the median average group size", function () {
      var res = formatter.getGroupStats({foo: [1, 2, 3], bar: [1]});

      expect(res.median).to.eql({name: "Median Size", value: 2});
    });

    it("should return the mode average group size", function () {
      var res = formatter.getGroupStats({foo: [1, 2, 3], bar: [1], baz: [2]});

      expect(res.mode).to.eql({name: "Mode Size", value: "1"});
    });

    it("should return be able to return multiple modes", function () {
      var res = formatter.getGroupStats({foo: [1, 2, 3], bar: [1], baz: [2], abc: [5, 6], def: [5, 6]});

      expect(res.mode).to.eql({name: "Mode Size", value: "1, 2"});
    });

    it("should not return all properties when there are no group", function () {
      var res = formatter.getGroupStats({});

      expect(res).to.eql({
        count: {name: "Count", value: 0}
      });
    });
  });
});
