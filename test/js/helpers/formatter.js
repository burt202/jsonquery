const chai = require("chai")
const expect = chai.expect

const formatter = require("../../../src/js/helpers/formatter")

describe("formatter", function() {

  describe("filter", function() {
    const mockDataForFiltering = [
      {name: "foo", type: "cash", deleted: true},
      {name: "bar", type: "cash", deleted: false},
      {name: "baz", type: "loan", deleted: true},
    ]

    const mockSchema = {
      type: "string",
      deleted: "bool",
    }

    it("should not filter anything if no filters are defined", function() {
      const res = formatter.filter(mockDataForFiltering, mockSchema, [])

      expect(res).to.eql(mockDataForFiltering)
    })

    it("should filter on multiple fields", function() {
      const res = formatter.filter(mockDataForFiltering, mockSchema, [
        {name: "type", value: "cash", operator: "eq", active: true},
        {name: "deleted", operator: "false", active: true},
      ])

      expect(res).to.eql([
        {name: "bar", type: "cash", deleted: false},
      ])
    })

    it("should ignore inactive filters", function() {
      const res = formatter.filter(mockDataForFiltering, mockSchema, [
        {name: "type", value: "cash", operator: "eq", active: true},
        {name: "deleted", operator: "false", active: false},
      ])

      expect(res).to.eql([
        {name: "foo", type: "cash", deleted: true},
        {name: "bar", type: "cash", deleted: false},
      ])
    })

    describe("string", function() {

      const mockDataForFiltering = [
        {name: "foo", type: "cash"},
        {name: "bar", type: "cash"},
        {name: "baz", type: "loan"},
        {name: "abc", type: null},
        {name: "123", type: "card"},
      ]

      const mockSchema = {
        type: "string",
      }

      it("should filter when operator is 'eq'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "type", operator: "eq", value: "cash", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", type: "cash"},
          {name: "bar", type: "cash"},
        ])
      })

      it("should filter when operator is 'neq'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "type", operator: "neq", value: "cash", active: true},
        ])

        expect(res).to.eql([
          {name: "baz", type: "loan"},
          {name: "abc", type: null},
          {name: "123", type: "card"},
        ])
      })

      it("should filter when operator is 'nl'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "type", operator: "nl", active: true},
        ])

        expect(res).to.eql([
          {name: "abc", type: null},
        ])
      })

      it("should filter when operator is 'nnl'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "type", operator: "nnl", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", type: "cash"},
          {name: "bar", type: "cash"},
          {name: "baz", type: "loan"},
          {name: "123", type: "card"},
        ])
      })

      it("should filter when operator is 'iof'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "type", operator: "iof", value: "cash,loan", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", type: "cash"},
          {name: "bar", type: "cash"},
          {name: "baz", type: "loan"},
        ])
      })

      it("should filter when operator is 'rgm'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "type", operator: "rgm", value: "ca", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", type: "cash"},
          {name: "bar", type: "cash"},
          {name: "123", type: "card"},
        ])
      })
    })

    describe("int", function() {

      const mockDataForFiltering = [
        {name: "foo", code: 101},
        {name: "bar", code: 102},
        {name: "baz", code: 103},
        {name: "abc", code: 103},
        {name: "123", code: null},
      ]

      const mockSchema = {
        code: "int",
      }

      it("should filter when operator is 'eq'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "eq", value: 102, active: true},
        ])

        expect(res).to.eql([
          {name: "bar", code: 102},
        ])
      })

      it("should filter when operator is 'neq'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "neq", value: 102, active: true},
        ])

        expect(res).to.eql([
          {name: "foo", code: 101},
          {name: "baz", code: 103},
          {name: "abc", code: 103},
          {name: "123", code: null},
        ])
      })

      it("should filter when operator is 'nl'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "nl", active: true},
        ])

        expect(res).to.eql([
          {name: "123", code: null},
        ])
      })

      it("should filter when operator is 'nnl'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "nnl", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", code: 101},
          {name: "bar", code: 102},
          {name: "baz", code: 103},
          {name: "abc", code: 103},
        ])
      })

      it("should filter when operator is 'gt'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "gt", value: 102, active: true},
        ])

        expect(res).to.eql([
          {name: "baz", code: 103},
          {name: "abc", code: 103},
        ])
      })

      it("should filter when operator is 'lt'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "lt", value: 102, active: true},
        ])

        expect(res).to.eql([
          {name: "foo", code: 101},
          {name: "123", code: null},
        ])
      })

      it("should filter when operator is 'gte'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "gte", value: 102, active: true},
        ])

        expect(res).to.eql([
          {name: "bar", code: 102},
          {name: "baz", code: 103},
          {name: "abc", code: 103},
        ])
      })

      it("should filter when operator is 'lte'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "lte", value: 102, active: true},
        ])

        expect(res).to.eql([
          {name: "foo", code: 101},
          {name: "bar", code: 102},
          {name: "123", code: null},
        ])
      })

      it("should filter when operator is 'iof'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "iof", value: "101,103", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", code: 101},
          {name: "baz", code: 103},
          {name: "abc", code: 103},
        ])
      })

      it("should honour decimals in the filter value", function() {
        const mockFilters = [
          {name: "foo", code: 101.5},
          {name: "bar", code: 102},
        ]

        const res = formatter.filter(mockFilters, mockSchema, [
          {name: "code", operator: "gt", value: 101.9, active: true},
        ])

        expect(res).to.eql([
          {name: "bar", code: 102},
        ])
      })
    })

    describe("bool", function() {

      const mockDataForFiltering = [
        {name: "foo", deleted: true},
        {name: "bar", deleted: false},
        {name: "baz", deleted: null},
        {name: "abc", deleted: true},
        {name: "123", deleted: false},
      ]

      const mockSchema = {
        deleted: "bool",
      }

      it("should filter when true", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "deleted", operator: "true", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", deleted: true},
          {name: "abc", deleted: true},
        ])
      })

      it("should filter when false", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "deleted", operator: "false", active: true},
        ])

        expect(res).to.eql([
          {name: "bar", deleted: false},
          {name: "123", deleted: false},
        ])
      })

      it("should filter when null", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "deleted", operator: "nl", active: true},
        ])

        expect(res).to.eql([
          {name: "baz", deleted: null},
        ])
      })
    })

    describe("date", function() {
      const mockDataForFiltering = [
        {name: "foo", dateCreated: "2016-07-11T17:16:27"},
        {name: "bar", dateCreated: "2016-08-11T17:16:27"},
        {name: "baz", dateCreated: "2016-06-11T17:16:27"},
        {name: "abc", dateCreated: null},
        {name: "123", dateCreated: "2016-07-11T17:16:27"},
      ]

      const mockSchema = {
        dateCreated: "date",
      }

      it("should filter when operator is 'nl'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "nl", value: "", active: true},
        ])

        expect(res).to.eql([
          {name: "abc", dateCreated: null},
        ])
      })

      it("should filter when operator is 'nnl'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "nnl", value: "", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", dateCreated: "2016-07-11T17:16:27"},
          {name: "bar", dateCreated: "2016-08-11T17:16:27"},
          {name: "baz", dateCreated: "2016-06-11T17:16:27"},
          {name: "123", dateCreated: "2016-07-11T17:16:27"},
        ])
      })

      it("should filter when operator is 'eq'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "eq", value: "20160611", active: true},
        ])

        expect(res).to.eql([
          {name: "baz", dateCreated: "2016-06-11T17:16:27"},
        ])
      })

      it("should filter when operator is 'be'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "be", value: "20160811", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", dateCreated: "2016-07-11T17:16:27"},
          {name: "baz", dateCreated: "2016-06-11T17:16:27"},
          {name: "123", dateCreated: "2016-07-11T17:16:27"},
        ])
      })

      it("should filter when operator is 'af'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "af", value: "20160712", active: true},
        ])

        expect(res).to.eql([
          {name: "bar", dateCreated: "2016-08-11T17:16:27"},
        ])
      })
    })

    describe("array", function() {

      const mockDataForFiltering = [
        {name: "foo", types: ["cash"]},
        {name: "bar", types: ["cash", "card"]},
        {name: "baz", types: []},
        {name: "abc", types: ["card"]},
        {name: "123", types: ["investment"]},
      ]

      const mockSchema = {
        types: "array",
      }

      it("should filter when operator is 'cos'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "types", operator: "cos", value: "card", active: true},
        ])

        expect(res).to.eql([
          {name: "bar", types: ["cash", "card"]},
          {name: "abc", types: ["card"]},
        ])
      })

      it("should filter when operator is 'hl'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "types", operator: "hl", value: "2", active: true},
        ])

        expect(res).to.eql([
          {name: "bar", types: ["cash", "card"]},
        ])
      })
    })
  })

  describe("group", function() {
    const mockDataForGrouping = [
      {name: "foo", type: "cash"},
      {name: "bar", type: "cash"},
      {name: "baz", type: "loan"},
    ]

    it("should group data if groupBy argument is passed", function() {
      expect(formatter.group(mockDataForGrouping, "type")).to.eql({
        "cash": [
          {
            "name": "foo",
            "type": "cash",
          },
          {
            "name": "bar",
            "type": "cash",
          },
        ],
        "loan": [
          {
            "name": "baz",
            "type": "loan",
          },
        ],
      })
    })
  })

  describe("sort", function() {
    const mockDataForSorting = [
      {name: "foo", num: 2},
      {name: "bar", num: 1},
      {name: "baz", num: 3},
    ]

    it("should sort the data in ascending order", function() {
      expect(formatter.sort(mockDataForSorting, "num", "asc")).to.eql([
        {name: "bar", num: 1},
        {name: "foo", num: 2},
        {name: "baz", num: 3},
      ])
    })

    it("should sort the data in descending order", function() {
      expect(formatter.sort(mockDataForSorting, "num", "desc")).to.eql([
        {name: "baz", num: 3},
        {name: "foo", num: 2},
        {name: "bar", num: 1},
      ])
    })
  })

  describe("getGroupStats", function() {
    it("should return the total number of groups", function() {
      const res = formatter.getGroupStats({foo: [], bar: []})

      expect(res.count).to.eql({name: "Count", value: 2})
    })

    it("should return the size of the biggest group", function() {
      const res = formatter.getGroupStats({foo: [1, 2, 3], bar: [1]})

      expect(res.max).to.eql({name: "Max Size", value: 3})
    })

    it("should return the size of the smallest group", function() {
      const res = formatter.getGroupStats({foo: [1, 2, 3], bar: [1]})

      expect(res.min).to.eql({name: "Min Size", value: 1})
    })

    it("should return the mean average group size", function() {
      const res = formatter.getGroupStats({foo: [1, 2, 3], bar: [1]})

      expect(res.mean).to.eql({name: "Mean Size", value: 2})
    })

    it("should return the median average group size", function() {
      const res = formatter.getGroupStats({foo: [1, 2, 3], bar: [1]})

      expect(res.median).to.eql({name: "Median Size", value: 2})
    })

    it("should return the mode average group size", function() {
      const res = formatter.getGroupStats({foo: [1, 2, 3], bar: [1], baz: [2]})

      expect(res.mode).to.eql({name: "Mode Size", value: "1"})
    })

    it("should return be able to return multiple modes", function() {
      const res = formatter.getGroupStats({foo: [1, 2, 3], bar: [1], baz: [2], abc: [5, 6], def: [5, 6]})

      expect(res.mode).to.eql({name: "Mode Size", value: "1, 2"})
    })

    it("should not return all properties when there are no group", function() {
      const res = formatter.getGroupStats({})

      expect(res).to.eql({
        count: {name: "Count", value: 0},
      })
    })
  })
})
