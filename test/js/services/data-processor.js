const chai = require("chai")
const expect = chai.expect

const dateProcessor = require("../../../src/js/services/data-processor")

describe("dateProcessor", function() {

  describe("filter", function() {
    const mockDataForFiltering = [
      {name: "foo", type: "cash", num: 1, deleted: true},
      {name: "bar", type: "cash", num: 2, deleted: false},
      {name: "baz", type: "loan", num: 3, deleted: true},
    ]

    const mockSchema = {
      type: "string",
      deleted: "bool",
      num: "number",
    }

    it("should not filter anything if no filters are defined", function() {
      const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [])

      expect(res).to.eql(mockDataForFiltering)
    })

    it("should filter on multiple fields", function() {
      const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
        {name: "type", value: "cash", operator: "eq", active: true},
        {name: "deleted", operator: "false", active: true},
      ])

      expect(res).to.eql([
        {name: "bar", type: "cash", num: 2, deleted: false},
      ])
    })

    it("should filter on the same field multiple times", function() {
      const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
        {name: "num", value: "1,2", operator: "iof", active: true},
        {name: "num", value: "2", operator: "lt", active: true},
      ])

      expect(res).to.eql([
        {name: "foo", type: "cash", num: 1, deleted: true},
      ])
    })

    it("should ignore inactive filters", function() {
      const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
        {name: "type", value: "cash", operator: "eq", active: true},
        {name: "deleted", operator: "false", active: false},
      ])

      expect(res).to.eql([
        {name: "foo", type: "cash", num: 1, deleted: true},
        {name: "bar", type: "cash", num: 2, deleted: false},
      ])
    })

    it("should ignore invalid operators", function() {
      const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
        {name: "type", value: "cash", operator: "xxx", active: true},
      ])

      expect(res).to.eql(mockDataForFiltering)
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
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "type", operator: "eq", value: "cash", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", type: "cash"},
          {name: "bar", type: "cash"},
        ])
      })

      it("should filter when operator is 'neq'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "type", operator: "neq", value: "cash", active: true},
        ])

        expect(res).to.eql([
          {name: "baz", type: "loan"},
          {name: "abc", type: null},
          {name: "123", type: "card"},
        ])
      })

      it("should filter when operator is 'nl'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "type", operator: "nl", active: true},
        ])

        expect(res).to.eql([
          {name: "abc", type: null},
        ])
      })

      it("should filter when operator is 'nnl'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
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
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "type", operator: "iof", value: "cash,loan", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", type: "cash"},
          {name: "bar", type: "cash"},
          {name: "baz", type: "loan"},
        ])
      })

      it("should filter when operator is 'inof'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "type", operator: "inof", value: "cash,loan", active: true},
        ])

        expect(res).to.eql([
          {name: "abc", type: null},
          {name: "123", type: "card"},
        ])
      })

      it("should filter when operator is 'rgm'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "type", operator: "rgm", value: "ca", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", type: "cash"},
          {name: "bar", type: "cash"},
          {name: "123", type: "card"},
        ])
      })
    })

    describe("number", function() {

      const mockDataForFiltering = [
        {name: "foo", code: 101},
        {name: "bar", code: 102},
        {name: "baz", code: 103},
        {name: "abc", code: 103},
        {name: "123", code: null},
        {name: "456", code: 0},
      ]

      const mockSchema = {
        code: "number",
      }

      it("should filter when operator is 'eq'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "eq", value: "102", active: true},
        ])

        expect(res).to.eql([
          {name: "bar", code: 102},
        ])
      })

      it("should filter when operator is 'neq'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "neq", value: "102", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", code: 101},
          {name: "baz", code: 103},
          {name: "abc", code: 103},
          {name: "123", code: null},
          {name: "456", code: 0},
        ])
      })

      it("should filter when operator is 'nl'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "nl", active: true},
        ])

        expect(res).to.eql([
          {name: "123", code: null},
        ])
      })

      it("should filter when operator is 'nnl'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "nnl", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", code: 101},
          {name: "bar", code: 102},
          {name: "baz", code: 103},
          {name: "abc", code: 103},
          {name: "456", code: 0},
        ])
      })

      it("should filter when operator is 'gt'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "gt", value: "102", active: true},
        ])

        expect(res).to.eql([
          {name: "baz", code: 103},
          {name: "abc", code: 103},
        ])
      })

      it("should filter when operator is 'lt'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "lt", value: "102", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", code: 101},
          {name: "123", code: null},
          {name: "456", code: 0},
        ])
      })

      it("should filter when operator is 'gte'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "gte", value: "102", active: true},
        ])

        expect(res).to.eql([
          {name: "bar", code: 102},
          {name: "baz", code: 103},
          {name: "abc", code: 103},
        ])
      })

      it("should filter when operator is 'lte'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "lte", value: "102", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", code: 101},
          {name: "bar", code: 102},
          {name: "123", code: null},
          {name: "456", code: 0},
        ])
      })

      it("should filter when operator is 'iof'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "iof", value: "101,103", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", code: 101},
          {name: "baz", code: 103},
          {name: "abc", code: 103},
        ])
      })

      it("should filter when operator is 'iof' and one of the values is null", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "iof", value: "101,", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", code: 101},
          {name: "123", code: null},
        ])
      })

      it("should filter when operator is 'iof' and one of the values is 0", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "iof", value: "101,0", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", code: 101},
          {name: "456", code: 0},
        ])
      })

      it("should filter when operator is 'inof'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "inof", value: "101,103", active: true},
        ])

        expect(res).to.eql([
          {name: "bar", code: 102},
          {name: "123", code: null},
          {name: "456", code: 0},
        ])
      })

      it("should filter when operator is 'btw'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "btw", value: "101", value1: "103", active: true},
        ])

        expect(res).to.eql([
          {name: "bar", code: 102},
        ])
      })

      it("should honour decimals in the filter value", function() {
        const mockFilters = [
          {name: "foo", code: 101.5},
          {name: "bar", code: 102},
        ]

        const res = dateProcessor.filter(mockFilters, mockSchema, [
          {name: "code", operator: "gt", value: "101.9", active: true},
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
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "deleted", operator: "true", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", deleted: true},
          {name: "abc", deleted: true},
        ])
      })

      it("should filter when false", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "deleted", operator: "false", active: true},
        ])

        expect(res).to.eql([
          {name: "bar", deleted: false},
          {name: "123", deleted: false},
        ])
      })

      it("should filter when null", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "deleted", operator: "nl", active: true},
        ])

        expect(res).to.eql([
          {name: "baz", deleted: null},
        ])
      })

      it("should filter when not null", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "deleted", operator: "nnl", active: true},
        ])

        expect(res).to.eql([
        {name: "foo", deleted: true},
        {name: "bar", deleted: false},
        {name: "abc", deleted: true},
        {name: "123", deleted: false},
        ])
      })
    })

    describe("date", function() {
      const mockDataForFiltering = [
        {name: "foo", dateCreated: "2016-09-11T17:16:27"},
        {name: "bar", dateCreated: "2016-08-11T17:16:27"},
        {name: "baz", dateCreated: "2016-06-11T17:16:27"},
        {name: "abc", dateCreated: null},
        {name: "123", dateCreated: "2016-07-11T17:16:27"},
      ]

      const mockSchema = {
        dateCreated: "date",
      }

      it("should filter when operator is 'eq'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "eq", value: "2016-07-11T17:16:27", active: true},
        ])

        expect(res).to.eql([
          {name: "123", dateCreated: "2016-07-11T17:16:27"},
        ])
      })

      it("should filter when operator is 'neq'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "neq", value: "2016-07-11T17:16:27", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", dateCreated: "2016-09-11T17:16:27"},
          {name: "bar", dateCreated: "2016-08-11T17:16:27"},
          {name: "baz", dateCreated: "2016-06-11T17:16:27"},
          {name: "abc", dateCreated: null},
        ])
      })

      it("should filter when operator is 'nl'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "nl", value: "", active: true},
        ])

        expect(res).to.eql([
          {name: "abc", dateCreated: null},
        ])
      })

      it("should filter when operator is 'nnl'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "nnl", value: "", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", dateCreated: "2016-09-11T17:16:27"},
          {name: "bar", dateCreated: "2016-08-11T17:16:27"},
          {name: "baz", dateCreated: "2016-06-11T17:16:27"},
          {name: "123", dateCreated: "2016-07-11T17:16:27"},
        ])
      })

      it("should filter when operator is 'sd'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "sd", value: "20160611", active: true},
        ])

        expect(res).to.eql([
          {name: "baz", dateCreated: "2016-06-11T17:16:27"},
        ])
      })

      it("should filter when operator is 'be'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "be", value: "20160811", active: true},
        ])

        expect(res).to.eql([
          {name: "baz", dateCreated: "2016-06-11T17:16:27"},
          {name: "abc", dateCreated: null},
          {name: "123", dateCreated: "2016-07-11T17:16:27"},
        ])
      })

      it("should filter when operator is 'be' for datetime string", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "be", value: "20160811 1800", active: true},
        ])

        expect(res).to.eql([
          {name: "bar", dateCreated: "2016-08-11T17:16:27"},
          {name: "baz", dateCreated: "2016-06-11T17:16:27"},
          {name: "abc", dateCreated: null},
          {name: "123", dateCreated: "2016-07-11T17:16:27"},
        ])
      })

      it("should filter when operator is 'af'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "af", value: "20160712", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", dateCreated: "2016-09-11T17:16:27"},
          {name: "bar", dateCreated: "2016-08-11T17:16:27"},
        ])
      })

      it("should filter when operator is 'af' for datetime string", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "af", value: "20160711 0345", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", dateCreated: "2016-09-11T17:16:27"},
          {name: "bar", dateCreated: "2016-08-11T17:16:27"},
          {name: "123", dateCreated: "2016-07-11T17:16:27"},
        ])
      })

      it("should filter when operator is 'btw'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "btw", value: "20160712", value1: "20160910", active: true},
        ])

        expect(res).to.eql([
          {name: "bar", dateCreated: "2016-08-11T17:16:27"},
        ])
      })

      it("should filter when operator is 'btw' for datetime strings", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "btw", value: "20160711 0345", value1: "20160911 1854", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", dateCreated: "2016-09-11T17:16:27"},
          {name: "bar", dateCreated: "2016-08-11T17:16:27"},
          {name: "123", dateCreated: "2016-07-11T17:16:27"},
        ])
      })
    })

    describe("time", function() {
      const mockDataForFiltering = [
        {time: "00:00:00", value: 64},
        {time: "08:00:10", value: 63},
        {time: null, value: 64},
        {time: "15:02:30", value: 65},
        {time: "01:00:00", value: 65},
      ]

      const mockSchema = {
        time: "time",
      }

      it("should filter when operator is 'eq'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "time", operator: "eq", value: "15:02:30", active: true},
        ])

        expect(res).to.eql([
          {time: "15:02:30", value: 65},
        ])
      })

      it("should filter when operator is 'neq'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "time", operator: "neq", value: "15:02:30", active: true},
        ])

        expect(res).to.eql([
          {time: "00:00:00", value: 64},
          {time: "08:00:10", value: 63},
          {time: null, value: 64},
          {time: "01:00:00", value: 65},
        ])
      })

      it("should filter when operator is 'nl'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "time", operator: "nl", value: "", active: true},
        ])

        expect(res).to.eql([
          {time: null, value: 64},
        ])
      })

      it("should filter when operator is 'nnl'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "time", operator: "nnl", value: "", active: true},
        ])

        expect(res).to.eql([
          {time: "00:00:00", value: 64},
          {time: "08:00:10", value: 63},
          {time: "15:02:30", value: 65},
          {time: "01:00:00", value: 65},
        ])
      })

      it("should filter when operator is 'be'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "time", operator: "be", value: "02:08:56", active: true},
        ])

        expect(res).to.eql([
          {time: "00:00:00", value: 64},
          {time: "01:00:00", value: 65},
        ])
      })

      it("should filter when operator is 'af'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "time", operator: "af", value: "02:08:56", active: true},
        ])

        expect(res).to.eql([
          {time: "08:00:10", value: 63},
          {time: "15:02:30", value: 65},
        ])
      })

      it("should filter when operator is 'btw'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "time", operator: "btw", value: "02:08:56", value1: "09:08", active: true},
        ])

        expect(res).to.eql([
          {time: "08:00:10", value: 63},
        ])
      })
    })

    describe("array", function() {

      const mockDataForFiltering = [
        {name: "foo", types: ["cash"]},
        {name: "bar", types: ["cash", "card"]},
        {name: "baz", types: []},
        {name: "abc", types: ["card", 101]},
        {name: "123", types: ["investment"]},
      ]

      const mockSchema = {
        types: "array",
      }

      it("should filter when operator is 'cos'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "types", operator: "con", value: "101", active: true},
        ])

        expect(res).to.eql([
          {name: "abc", types: ["card", 101]},
        ])
      })

      it("should filter when operator is 'cos'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "types", operator: "cos", value: "card", active: true},
        ])

        expect(res).to.eql([
          {name: "bar", types: ["cash", "card"]},
          {name: "abc", types: ["card", 101]},
        ])
      })

      it("should filter when operator is 'hl'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "types", operator: "hl", value: "0", active: true},
        ])

        expect(res).to.eql([
          {name: "baz", types: []},
        ])
      })

      it("should filter when operator is 'dhl'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "types", operator: "dhl", value: "0", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", types: ["cash"]},
          {name: "bar", types: ["cash", "card"]},
          {name: "abc", types: ["card", 101]},
          {name: "123", types: ["investment"]},
        ])
      })

      it("should filter when operator is 'hlgt'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "types", operator: "hlgt", value: "1", active: true},
        ])

        expect(res).to.eql([
          {name: "bar", types: ["cash", "card"]},
          {name: "abc", types: ["card", 101]},
        ])
      })

      it("should filter when operator is 'hlgte'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "types", operator: "hlgte", value: "1", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", types: ["cash"]},
          {name: "bar", types: ["cash", "card"]},
          {name: "abc", types: ["card", 101]},
          {name: "123", types: ["investment"]},
        ])
      })

      it("should filter when operator is 'hllt'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "types", operator: "hllt", value: "2", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", types: ["cash"]},
          {name: "baz", types: []},
          {name: "123", types: ["investment"]},
        ])
      })

      it("should filter when operator is 'hllte'", function() {
        const res = dateProcessor.filter(mockDataForFiltering, mockSchema, [
          {name: "types", operator: "hllte", value: "2", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", types: ["cash"]},
          {name: "bar", types: ["cash", "card"]},
          {name: "baz", types: []},
          {name: "abc", types: ["card", 101]},
          {name: "123", types: ["investment"]},
        ])
      })
    })
  })

  describe("group", function() {
    const mockDataForGrouping = [
      {name: "foo", type: "cash", auto: true},
      {name: "bar", type: "cash", auto: false},
      {name: "baz", type: "loan", auto: true},
      {name: "abc", type: "card", auto: true},
      {name: "123", type: "card", auto: false},
      {name: "test", type: "card", auto: true},
    ]

    it("should group data at 1 level", function() {
      expect(dateProcessor.group(["type"], false, false, mockDataForGrouping)).to.eql({
        cash: [
          {name: "foo", type: "cash", auto: true},
          {name: "bar", type: "cash", auto: false},
        ],
        loan: [
          {name: "baz", type: "loan", auto: true},
        ],
        card: [
          {name: "abc", type: "card", auto: true},
          {name: "123", type: "card", auto: false},
          {name: "test", type: "card", auto: true},
        ],
      })
    })

    it("should group data at 2 levels", function() {
      expect(dateProcessor.group(["type", "auto"], false, false, mockDataForGrouping)).to.eql({
        cash: {
          true: [{name: "foo", type: "cash", auto: true}],
          false: [{name: "bar", type: "cash", auto: false}],
        },
        loan: {
          true: [{name: "baz", type: "loan", auto: true}],
        },
        card: {
          true: [{name: "abc", type: "card", auto: true}, {name: "test", type: "card", auto: true}],
          false: [{name: "123", type: "card", auto: false}],
        },
      })
    })

    it("should group data at 1 level with counts", function() {
      expect(dateProcessor.group(["type"], true, false, mockDataForGrouping)).to.eql({
        card: 3,
        cash: 2,
        loan: 1,
      })
    })

    it("should group data at 2 levels with counts", function() {
      expect(dateProcessor.group(["type", "auto"], true, false, mockDataForGrouping)).to.eql({
        cash: {false: 1, true: 1},
        loan: {true: 1},
        card: {true: 2, false: 1},
      })
    })

    it("should group data at 1 level with flatten", function() {
      expect(dateProcessor.group(["type"], false, true, mockDataForGrouping)).to.eql({
        cash: [
          {name: "foo", type: "cash", auto: true},
          {name: "bar", type: "cash", auto: false},
        ],
        loan: [
          {name: "baz", type: "loan", auto: true},
        ],
        card: [
          {name: "abc", type: "card", auto: true},
          {name: "123", type: "card", auto: false},
          {name: "test", type: "card", auto: true},
        ],
      })
    })

    it("should group data at 2 levels with flatten", function() {
      expect(dateProcessor.group(["type", "auto"], false, true, mockDataForGrouping)).to.eql({
        "cash - true": [{name: "foo", type: "cash", auto: true}],
        "cash - false": [{name: "bar", type: "cash", auto: false}],
        "loan - true": [{name: "baz", type: "loan", auto: true}],
        "card - true": [{name: "abc", type: "card", auto: true}, {name: "test", type: "card", auto: true}],
        "card - false": [{name: "123", type: "card", auto: false}],
      })
    })

    it("should group data at 1 level with counts and flatten", function() {
      expect(dateProcessor.group(["type"], true, true, mockDataForGrouping)).to.eql({
        card: 3,
        cash: 2,
        loan: 1,
      })
    })

    it("should group data at 2 levels with counts and flatten", function() {
      expect(dateProcessor.group(["type", "auto"], true, true, mockDataForGrouping)).to.eql({
        "cash - true": 1,
        "cash - false": 1,
        "loan - true": 1,
        "card - true": 2,
        "card - false": 1,
      })
    })
  })

  describe("sort", function() {
    const mockDataForSorting = [
      {artist: "Coldplay", album: "Parachutes", trackNo: 2},
      {artist: "Coldplay", album: "A Rush Of Blood", trackNo: 3},
      {artist: "Coldplay", album: "A Rush Of Blood", trackNo: 1},
      {artist: "Coldplay", album: "Parachutes", trackNo: 5},
      {artist: "Coldplay", album: "Parachutes", trackNo: 1},
    ]

    it("should sort the data in ascending order", function() {
      const sorters = [{field: "trackNo", direction: "asc"}]

      expect(dateProcessor.sort(sorters, mockDataForSorting)).to.eql([
        {artist: "Coldplay", album: "A Rush Of Blood", trackNo: 1},
        {artist: "Coldplay", album: "Parachutes", trackNo: 1},
        {artist: "Coldplay", album: "Parachutes", trackNo: 2},
        {artist: "Coldplay", album: "A Rush Of Blood", trackNo: 3},
        {artist: "Coldplay", album: "Parachutes", trackNo: 5},
      ])
    })

    it("should sort the data in descending order", function() {
      const sorters = [{field: "trackNo", direction: "desc"}]

      expect(dateProcessor.sort(sorters, mockDataForSorting)).to.eql([
        {artist: "Coldplay", album: "Parachutes", trackNo: 5},
        {artist: "Coldplay", album: "A Rush Of Blood", trackNo: 3},
        {artist: "Coldplay", album: "Parachutes", trackNo: 2},
        {artist: "Coldplay", album: "A Rush Of Blood", trackNo: 1},
        {artist: "Coldplay", album: "Parachutes", trackNo: 1},
      ])
    })

    it("should sort the data using multiple sorts", function() {
      const sorters = [
        {field: "album", direction: "asc"},
        {field: "trackNo", direction: "asc"},
      ]

      expect(dateProcessor.sort(sorters, mockDataForSorting)).to.eql([
        {artist: "Coldplay", album: "A Rush Of Blood", trackNo: 1},
        {artist: "Coldplay", album: "A Rush Of Blood", trackNo: 3},
        {artist: "Coldplay", album: "Parachutes", trackNo: 1},
        {artist: "Coldplay", album: "Parachutes", trackNo: 2},
        {artist: "Coldplay", album: "Parachutes", trackNo: 5},
      ])
    })
  })

  describe("sortAndLimitObject", function() {
    const mockDataForSorting = {
      "cash - true": 1,
      "loan - true": 1,
      "card - true": 2,
      "cash - false": 1,
      "card - false": 1,
    }

    it("should return object in order of count descending", function() {
      expect(dateProcessor.sortAndLimitObject("desc", null, mockDataForSorting)).to.eql([
        {name: "card - true", count: 2, percentage: 33.33},
        {name: "cash - true", count: 1, percentage: 16.67},
        {name: "loan - true", count: 1, percentage: 16.67},
        {name: "cash - false", count: 1, percentage: 16.67},
        {name: "card - false", count: 1, percentage: 16.67},
      ])
    })

    it("should return object in order of count descending limited by number", function() {
      expect(dateProcessor.sortAndLimitObject("desc", 3, mockDataForSorting)).to.eql([
        {name: "card - true", count: 2, percentage: 50},
        {name: "cash - true", count: 1, percentage: 25},
        {name: "loan - true", count: 1, percentage: 25},
      ])
    })

    it("should return object in order of count ascending", function() {
      expect(dateProcessor.sortAndLimitObject("asc", null, mockDataForSorting)).to.eql([
        {name: "cash - true", count: 1, percentage: 16.67},
        {name: "loan - true", count: 1, percentage: 16.67},
        {name: "cash - false", count: 1, percentage: 16.67},
        {name: "card - false", count: 1, percentage: 16.67},
        {name: "card - true", count: 2, percentage: 33.33},
      ])
    })

    it("should return object in order of count ascending limited by number", function() {
      expect(dateProcessor.sortAndLimitObject("asc", 3, mockDataForSorting)).to.eql([
        {name: "cash - true", count: 1, percentage: 33.33},
        {name: "loan - true", count: 1, percentage: 33.33},
        {name: "cash - false", count: 1, percentage: 33.33},
      ])
    })

    it("should return object in order of name descending", function() {
      expect(dateProcessor.sortAndLimitObject("namedesc", null, mockDataForSorting)).to.eql([
        {name: "loan - true", count: 1, percentage: 16.67},
        {name: "cash - true", count: 1, percentage: 16.67},
        {name: "cash - false", count: 1, percentage: 16.67},
        {name: "card - true", count: 2, percentage: 33.33},
        {name: "card - false", count: 1, percentage: 16.67},
      ])
    })

    it("should return object in order of name descending limited by number", function() {
      expect(dateProcessor.sortAndLimitObject("namedesc", 3, mockDataForSorting)).to.eql([
        {name: "loan - true", count: 1, percentage: 33.33},
        {name: "cash - true", count: 1, percentage: 33.33},
        {name: "cash - false", count: 1, percentage: 33.33},
      ])
    })

    it("should return object in order of name ascending", function() {
      expect(dateProcessor.sortAndLimitObject("nameasc", null, mockDataForSorting)).to.eql([
        {name: "card - false", count: 1, percentage: 16.67},
        {name: "card - true", count: 2, percentage: 33.33},
        {name: "cash - false", count: 1, percentage: 16.67},
        {name: "cash - true", count: 1, percentage: 16.67},
        {name: "loan - true", count: 1, percentage: 16.67},
      ])
    })

    it("should return object in order of name ascending limited by number", function() {
      expect(dateProcessor.sortAndLimitObject("nameasc", 3, mockDataForSorting)).to.eql([
        {name: "card - false", count: 1, percentage: 25},
        {name: "card - true", count: 2, percentage: 50},
        {name: "cash - false", count: 1, percentage: 25},
      ])
    })

    it("should return object in order of path/count descending", function() {
      expect(dateProcessor.sortAndLimitObject("pathdesc", null, mockDataForSorting)).to.eql([
        {name: "card - true", count: 2, percentage: 33.33},
        {name: "card - false", count: 1, percentage: 16.67},
        {name: "cash - true", count: 1, percentage: 16.67},
        {name: "cash - false", count: 1, percentage: 16.67},
        {name: "loan - true", count: 1, percentage: 16.67},
      ])
    })

    it("should return object in order of path/count descending limited by number", function() {
      expect(dateProcessor.sortAndLimitObject("pathdesc", 3, mockDataForSorting)).to.eql([
        {name: "card - true", count: 2, percentage: 50},
        {name: "card - false", count: 1, percentage: 25},
        {name: "cash - true", count: 1, percentage: 25},
      ])
    })

    it("should return object in order of path/count ascending", function() {
      expect(dateProcessor.sortAndLimitObject("pathasc", null, mockDataForSorting)).to.eql([
        {name: "card - false", count: 1, percentage: 16.67},
        {name: "card - true", count: 2, percentage: 33.33},
        {name: "cash - true", count: 1, percentage: 16.67},
        {name: "cash - false", count: 1, percentage: 16.67},
        {name: "loan - true", count: 1, percentage: 16.67},
      ])
    })

    it("should return object in order of path/count ascending limited by number", function() {
      expect(dateProcessor.sortAndLimitObject("pathasc", 3, mockDataForSorting)).to.eql([
        {name: "card - false", count: 1, percentage: 25},
        {name: "card - true", count: 2, percentage: 50},
        {name: "cash - true", count: 1, percentage: 25},
      ])
    })

    it("should return object in natural order of full month name", function() {
      const data = {
        November: 4081,
        April: 5777,
        February: 8836,
        March: 8150,
        January: 8595,
        October: 3868,
        August: 3581,
        July: 4880,
        June: 5506,
        December: 5161,
        September: 2418,
        May: 6839,
      }

      expect(dateProcessor.sortAndLimitObject("natural", null, data)).to.eql([
        {name: "January", count: 8595, percentage: 12.7},
        {name: "February", count: 8836, percentage: 13.05},
        {name: "March", count: 8150, percentage: 12.04},
        {name: "April", count: 5777, percentage: 8.53},
        {name: "May", count: 6839, percentage: 10.1},
        {name: "June", count: 5506, percentage: 8.13},
        {name: "July", count: 4880, percentage: 7.21},
        {name: "August", count: 3581, percentage: 5.29},
        {name: "September", count: 2418, percentage: 3.57},
        {name: "October", count: 3868, percentage: 5.71},
        {name: "November", count: 4081, percentage: 6.03},
        {name: "December", count: 5161, percentage: 7.62},
      ])
    })

    it("should return object in natural order of short month name", function() {
      const data = {
        Nov: 4081,
        Apr: 5777,
        Feb: 8836,
        Mar: 8150,
        Jan: 8595,
        Oct: 3868,
        Aug: 3581,
        Jul: 4880,
        Jun: 5506,
        Dec: 5161,
        Sep: 2418,
        May: 6839,
      }

      expect(dateProcessor.sortAndLimitObject("natural", null, data)).to.eql([
        {name: "Jan", count: 8595, percentage: 12.7},
        {name: "Feb", count: 8836, percentage: 13.05},
        {name: "Mar", count: 8150, percentage: 12.04},
        {name: "Apr", count: 5777, percentage: 8.53},
        {name: "May", count: 6839, percentage: 10.1},
        {name: "Jun", count: 5506, percentage: 8.13},
        {name: "Jul", count: 4880, percentage: 7.21},
        {name: "Aug", count: 3581, percentage: 5.29},
        {name: "Sep", count: 2418, percentage: 3.57},
        {name: "Oct", count: 3868, percentage: 5.71},
        {name: "Nov", count: 4081, percentage: 6.03},
        {name: "Dec", count: 5161, percentage: 7.62},
      ])
    })

    it("should return object in natural order of full day name", function() {
      const data = {
        Friday: 4081,
        Wednesday: 5777,
        Saturday: 8836,
        Tuesday: 8150,
        Sunday: 8595,
        Monday: 3868,
        Thursday: 3581,
      }

      expect(dateProcessor.sortAndLimitObject("natural", null, data)).to.eql([
        {name: "Monday", count: 3868, percentage: 9.02},
        {name: "Tuesday", count: 8150, percentage: 19},
        {name: "Wednesday", count: 5777, percentage: 13.47},
        {name: "Thursday", count: 3581, percentage: 8.35},
        {name: "Friday", count: 4081, percentage: 9.52},
        {name: "Saturday", count: 8836, percentage: 20.6},
        {name: "Sunday", count: 8595, percentage: 20.04},
      ])
    })

    it("should return object in natural order of short day name", function() {
      const data = {
        Fri: 4081,
        Wed: 5777,
        Sat: 8836,
        Tue: 8150,
        Sun: 8595,
        Mon: 3868,
        Thu: 3581,
      }

      expect(dateProcessor.sortAndLimitObject("natural", null, data)).to.eql([
        {name: "Mon", count: 3868, percentage: 9.02},
        {name: "Tue", count: 8150, percentage: 19},
        {name: "Wed", count: 5777, percentage: 13.47},
        {name: "Thu", count: 3581, percentage: 8.35},
        {name: "Fri", count: 4081, percentage: 9.52},
        {name: "Sat", count: 8836, percentage: 20.6},
        {name: "Sun", count: 8595, percentage: 20.04},
      ])
    })

    it("should return object in natural order of short day name limited by number", function() {
      const data = {
        Fri: 4081,
        Wed: 5777,
        Sat: 8836,
        Tue: 8150,
        Sun: 8595,
        Mon: 3868,
        Thu: 3581,
      }

      expect(dateProcessor.sortAndLimitObject("natural", 5, data)).to.eql([
        {name: "Mon", count: 3868, percentage: 15.19},
        {name: "Tue", count: 8150, percentage: 32.01},
        {name: "Wed", count: 5777, percentage: 22.69},
        {name: "Thu", count: 3581, percentage: 14.07},
        {name: "Fri", count: 4081, percentage: 16.03},
      ])
    })

    it("should sort name descending naturally if all numbers", function() {
      const data = {
        "52": 4081,
        "100": 5777,
        "89": 8836,
        "2": 8150,
        "22.4": 8595,
        "37.89": 3868,
        "10": 3581,
      }

      expect(dateProcessor.sortAndLimitObject("namedesc", null, data)).to.eql([
        {name: 100, count: 5777, percentage: 13.47},
        {name: 89, count: 8836, percentage: 20.6},
        {name: 52, count: 4081, percentage: 9.52},
        {name: 37.89, count: 3868, percentage: 9.02},
        {name: 22.4, count: 8595, percentage: 20.04},
        {name: 10, count: 3581, percentage: 8.35},
        {name: 2, count: 8150, percentage: 19},
      ])
    })
  })
})
