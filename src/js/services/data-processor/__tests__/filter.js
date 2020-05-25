const chai = require("chai")
const expect = chai.expect

const filter = require("../filter")

describe("filter", () => {
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

  it("should not filter anything if no filters are defined", () => {
    const res = filter(mockDataForFiltering, mockSchema, [])

    expect(res).to.eql(mockDataForFiltering)
  })

  it("should filter on multiple fields", () => {
    const res = filter(mockDataForFiltering, mockSchema, [
      {name: "type", value: "cash", operator: "eq", active: true},
      {name: "deleted", operator: "false", active: true},
    ])

    expect(res).to.eql([{name: "bar", type: "cash", num: 2, deleted: false}])
  })

  it("should filter on the same field multiple times", () => {
    const res = filter(mockDataForFiltering, mockSchema, [
      {name: "num", value: "1,2", operator: "iof", active: true},
      {name: "num", value: "2", operator: "lt", active: true},
    ])

    expect(res).to.eql([{name: "foo", type: "cash", num: 1, deleted: true}])
  })

  it("should ignore inactive filters", () => {
    const res = filter(mockDataForFiltering, mockSchema, [
      {name: "type", value: "cash", operator: "eq", active: true},
      {name: "deleted", operator: "false", active: false},
    ])

    expect(res).to.eql([
      {name: "foo", type: "cash", num: 1, deleted: true},
      {name: "bar", type: "cash", num: 2, deleted: false},
    ])
  })

  it("should ignore invalid operators", () => {
    const res = filter(mockDataForFiltering, mockSchema, [
      {name: "type", value: "cash", operator: "xxx", active: true},
    ])

    expect(res).to.eql(mockDataForFiltering)
  })

  describe("string", () => {
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

    it("should filter when operator is 'eq'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "type", operator: "eq", value: "cash", active: true},
      ])

      expect(res).to.eql([
        {name: "foo", type: "cash"},
        {name: "bar", type: "cash"},
      ])
    })

    it("should filter when operator is 'neq'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "type", operator: "neq", value: "cash", active: true},
      ])

      expect(res).to.eql([
        {name: "baz", type: "loan"},
        {name: "abc", type: null},
        {name: "123", type: "card"},
      ])
    })

    it("should filter when operator is 'nl'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "type", operator: "nl", active: true},
      ])

      expect(res).to.eql([{name: "abc", type: null}])
    })

    it("should filter when operator is 'nnl'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "type", operator: "nnl", active: true},
      ])

      expect(res).to.eql([
        {name: "foo", type: "cash"},
        {name: "bar", type: "cash"},
        {name: "baz", type: "loan"},
        {name: "123", type: "card"},
      ])
    })

    it("should filter when operator is 'iof'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "type", operator: "iof", value: "cash,loan", active: true},
      ])

      expect(res).to.eql([
        {name: "foo", type: "cash"},
        {name: "bar", type: "cash"},
        {name: "baz", type: "loan"},
      ])
    })

    it("should filter when operator is 'inof'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "type", operator: "inof", value: "cash,loan", active: true},
      ])

      expect(res).to.eql([
        {name: "abc", type: null},
        {name: "123", type: "card"},
      ])
    })

    it("should filter when operator is 'rgm'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "type", operator: "rgm", value: "ca", active: true},
      ])

      expect(res).to.eql([
        {name: "foo", type: "cash"},
        {name: "bar", type: "cash"},
        {name: "123", type: "card"},
      ])
    })

    it("should filter when operator is 'rgnm'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "type", operator: "rgnm", value: "ca", active: true},
      ])

      expect(res).to.eql([
        {name: "baz", type: "loan"},
        {name: "abc", type: null},
      ])
    })
  })

  describe("number", () => {
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

    it("should filter when operator is 'eq'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "code", operator: "eq", value: "102", active: true},
      ])

      expect(res).to.eql([{name: "bar", code: 102}])
    })

    it("should filter when operator is 'neq'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
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

    it("should filter when operator is 'nl'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "code", operator: "nl", active: true},
      ])

      expect(res).to.eql([{name: "123", code: null}])
    })

    it("should filter when operator is 'nnl'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
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

    it("should filter when operator is 'gt'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "code", operator: "gt", value: "102", active: true},
      ])

      expect(res).to.eql([
        {name: "baz", code: 103},
        {name: "abc", code: 103},
      ])
    })

    it("should filter when operator is 'lt'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "code", operator: "lt", value: "102", active: true},
      ])

      expect(res).to.eql([
        {name: "foo", code: 101},
        {name: "123", code: null},
        {name: "456", code: 0},
      ])
    })

    it("should filter when operator is 'gte'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "code", operator: "gte", value: "102", active: true},
      ])

      expect(res).to.eql([
        {name: "bar", code: 102},
        {name: "baz", code: 103},
        {name: "abc", code: 103},
      ])
    })

    it("should filter when operator is 'lte'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "code", operator: "lte", value: "102", active: true},
      ])

      expect(res).to.eql([
        {name: "foo", code: 101},
        {name: "bar", code: 102},
        {name: "123", code: null},
        {name: "456", code: 0},
      ])
    })

    it("should filter when operator is 'iof'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "code", operator: "iof", value: "101,103", active: true},
      ])

      expect(res).to.eql([
        {name: "foo", code: 101},
        {name: "baz", code: 103},
        {name: "abc", code: 103},
      ])
    })

    it("should filter when operator is 'iof' and one of the values is null", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "code", operator: "iof", value: "101,", active: true},
      ])

      expect(res).to.eql([
        {name: "foo", code: 101},
        {name: "123", code: null},
      ])
    })

    it("should filter when operator is 'iof' and one of the values is 0", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "code", operator: "iof", value: "101,0", active: true},
      ])

      expect(res).to.eql([
        {name: "foo", code: 101},
        {name: "456", code: 0},
      ])
    })

    it("should filter when operator is 'inof'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "code", operator: "inof", value: "101,103", active: true},
      ])

      expect(res).to.eql([
        {name: "bar", code: 102},
        {name: "123", code: null},
        {name: "456", code: 0},
      ])
    })

    it("should filter when operator is 'btw'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "code", operator: "btw", value: "101", value1: "103", active: true},
      ])

      expect(res).to.eql([{name: "bar", code: 102}])
    })

    it("should filter when operator is 'nbtw'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "code", operator: "nbtw", value: "101", value1: "103", active: true},
      ])

      expect(res).to.eql([
        {name: "foo", code: 101},
        {name: "baz", code: 103},
        {name: "abc", code: 103},
        {name: "123", code: null},
        {name: "456", code: 0},
      ])
    })

    it("should honour decimals in the filter value", () => {
      const mockFilters = [
        {name: "foo", code: 101.5},
        {name: "bar", code: 102},
      ]

      const res = filter(mockFilters, mockSchema, [
        {name: "code", operator: "gt", value: "101.9", active: true},
      ])

      expect(res).to.eql([{name: "bar", code: 102}])
    })
  })

  describe("bool", () => {
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

    it("should filter when true", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "deleted", operator: "true", active: true},
      ])

      expect(res).to.eql([
        {name: "foo", deleted: true},
        {name: "abc", deleted: true},
      ])
    })

    it("should filter when false", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "deleted", operator: "false", active: true},
      ])

      expect(res).to.eql([
        {name: "bar", deleted: false},
        {name: "123", deleted: false},
      ])
    })

    it("should filter when null", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "deleted", operator: "nl", active: true},
      ])

      expect(res).to.eql([{name: "baz", deleted: null}])
    })

    it("should filter when not null", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
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

  describe("date", () => {
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

    it("should filter when operator is 'eq'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "dateCreated", operator: "eq", value: "2016-07-11T17:16:27", active: true},
      ])

      expect(res).to.eql([{name: "123", dateCreated: "2016-07-11T17:16:27"}])
    })

    it("should filter when operator is 'neq'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "dateCreated", operator: "neq", value: "2016-07-11T17:16:27", active: true},
      ])

      expect(res).to.eql([
        {name: "foo", dateCreated: "2016-09-11T17:16:27"},
        {name: "bar", dateCreated: "2016-08-11T17:16:27"},
        {name: "baz", dateCreated: "2016-06-11T17:16:27"},
        {name: "abc", dateCreated: null},
      ])
    })

    it("should filter when operator is 'nl'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "dateCreated", operator: "nl", value: "", active: true},
      ])

      expect(res).to.eql([{name: "abc", dateCreated: null}])
    })

    it("should filter when operator is 'nnl'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "dateCreated", operator: "nnl", value: "", active: true},
      ])

      expect(res).to.eql([
        {name: "foo", dateCreated: "2016-09-11T17:16:27"},
        {name: "bar", dateCreated: "2016-08-11T17:16:27"},
        {name: "baz", dateCreated: "2016-06-11T17:16:27"},
        {name: "123", dateCreated: "2016-07-11T17:16:27"},
      ])
    })

    it("should filter when operator is 'sd'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "dateCreated", operator: "sd", value: "20160611", active: true},
      ])

      expect(res).to.eql([{name: "baz", dateCreated: "2016-06-11T17:16:27"}])
    })

    it("should filter when operator is 'be'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "dateCreated", operator: "be", value: "20160811", active: true},
      ])

      expect(res).to.eql([
        {name: "baz", dateCreated: "2016-06-11T17:16:27"},
        {name: "abc", dateCreated: null},
        {name: "123", dateCreated: "2016-07-11T17:16:27"},
      ])
    })

    it("should filter when operator is 'be' for datetime string", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "dateCreated", operator: "be", value: "20160811 1800", active: true},
      ])

      expect(res).to.eql([
        {name: "bar", dateCreated: "2016-08-11T17:16:27"},
        {name: "baz", dateCreated: "2016-06-11T17:16:27"},
        {name: "abc", dateCreated: null},
        {name: "123", dateCreated: "2016-07-11T17:16:27"},
      ])
    })

    it("should filter when operator is 'af'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "dateCreated", operator: "af", value: "20160712", active: true},
      ])

      expect(res).to.eql([
        {name: "foo", dateCreated: "2016-09-11T17:16:27"},
        {name: "bar", dateCreated: "2016-08-11T17:16:27"},
      ])
    })

    it("should filter when operator is 'af' for datetime string", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "dateCreated", operator: "af", value: "20160711 0345", active: true},
      ])

      expect(res).to.eql([
        {name: "foo", dateCreated: "2016-09-11T17:16:27"},
        {name: "bar", dateCreated: "2016-08-11T17:16:27"},
        {name: "123", dateCreated: "2016-07-11T17:16:27"},
      ])
    })

    it("should filter when operator is 'btw'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "dateCreated", operator: "btw", value: "20160712", value1: "20160910", active: true},
      ])

      expect(res).to.eql([{name: "bar", dateCreated: "2016-08-11T17:16:27"}])
    })

    it("should filter when operator is 'nbtw'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {
          name: "dateCreated",
          operator: "nbtw",
          value: "20160712",
          value1: "20160910",
          active: true,
        },
      ])

      expect(res).to.eql([
        {name: "foo", dateCreated: "2016-09-11T17:16:27"},
        {name: "baz", dateCreated: "2016-06-11T17:16:27"},
        {name: "abc", dateCreated: null},
        {name: "123", dateCreated: "2016-07-11T17:16:27"},
      ])
    })

    it("should filter when operator is 'btw' for datetime strings", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {
          name: "dateCreated",
          operator: "btw",
          value: "20160711 0345",
          value1: "20160911 1854",
          active: true,
        },
      ])

      expect(res).to.eql([
        {name: "foo", dateCreated: "2016-09-11T17:16:27"},
        {name: "bar", dateCreated: "2016-08-11T17:16:27"},
        {name: "123", dateCreated: "2016-07-11T17:16:27"},
      ])
    })

    it("should filter when operator is 'nbtw' for datetime strings", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {
          name: "dateCreated",
          operator: "nbtw",
          value: "20160711 0345",
          value1: "20160911 1854",
          active: true,
        },
      ])

      expect(res).to.eql([
        {name: "baz", dateCreated: "2016-06-11T17:16:27"},
        {name: "abc", dateCreated: null},
      ])
    })
  })

  describe("time", () => {
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

    it("should filter when operator is 'eq'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "time", operator: "eq", value: "15:02:30", active: true},
      ])

      expect(res).to.eql([{time: "15:02:30", value: 65}])
    })

    it("should filter when operator is 'neq'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "time", operator: "neq", value: "15:02:30", active: true},
      ])

      expect(res).to.eql([
        {time: "00:00:00", value: 64},
        {time: "08:00:10", value: 63},
        {time: null, value: 64},
        {time: "01:00:00", value: 65},
      ])
    })

    it("should filter when operator is 'nl'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "time", operator: "nl", value: "", active: true},
      ])

      expect(res).to.eql([{time: null, value: 64}])
    })

    it("should filter when operator is 'nnl'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "time", operator: "nnl", value: "", active: true},
      ])

      expect(res).to.eql([
        {time: "00:00:00", value: 64},
        {time: "08:00:10", value: 63},
        {time: "15:02:30", value: 65},
        {time: "01:00:00", value: 65},
      ])
    })

    it("should filter when operator is 'be'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "time", operator: "be", value: "02:08:56", active: true},
      ])

      expect(res).to.eql([
        {time: "00:00:00", value: 64},
        {time: "01:00:00", value: 65},
      ])
    })

    it("should filter when operator is 'af'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "time", operator: "af", value: "02:08:56", active: true},
      ])

      expect(res).to.eql([
        {time: "08:00:10", value: 63},
        {time: "15:02:30", value: 65},
      ])
    })

    it("should filter when operator is 'btw'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "time", operator: "btw", value: "02:08:56", value1: "09:08", active: true},
      ])

      expect(res).to.eql([{time: "08:00:10", value: 63}])
    })

    it("should filter when operator is 'nbtw'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "time", operator: "nbtw", value: "02:08:56", value1: "09:08", active: true},
      ])

      expect(res).to.eql([
        {time: "00:00:00", value: 64},
        {time: null, value: 64},
        {time: "15:02:30", value: 65},
        {time: "01:00:00", value: 65},
      ])
    })
  })

  describe("array", () => {
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

    it("should filter when operator is 'cos'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "types", operator: "con", value: "101", active: true},
      ])

      expect(res).to.eql([{name: "abc", types: ["card", 101]}])
    })

    it("should filter when operator is 'cos'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "types", operator: "cos", value: "card", active: true},
      ])

      expect(res).to.eql([
        {name: "bar", types: ["cash", "card"]},
        {name: "abc", types: ["card", 101]},
      ])
    })

    it("should filter when operator is 'cof'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "types", operator: "cof", value: "card,investment", active: true},
      ])

      expect(res).to.eql([
        {name: "bar", types: ["cash", "card"]},
        {name: "abc", types: ["card", 101]},
        {name: "123", types: ["investment"]},
      ])
    })

    it("should filter when operator is 'hl'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "types", operator: "hl", value: "0", active: true},
      ])

      expect(res).to.eql([{name: "baz", types: []}])
    })

    it("should filter when operator is 'dhl'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "types", operator: "dhl", value: "0", active: true},
      ])

      expect(res).to.eql([
        {name: "foo", types: ["cash"]},
        {name: "bar", types: ["cash", "card"]},
        {name: "abc", types: ["card", 101]},
        {name: "123", types: ["investment"]},
      ])
    })

    it("should filter when operator is 'hlgt'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "types", operator: "hlgt", value: "1", active: true},
      ])

      expect(res).to.eql([
        {name: "bar", types: ["cash", "card"]},
        {name: "abc", types: ["card", 101]},
      ])
    })

    it("should filter when operator is 'hlgte'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "types", operator: "hlgte", value: "1", active: true},
      ])

      expect(res).to.eql([
        {name: "foo", types: ["cash"]},
        {name: "bar", types: ["cash", "card"]},
        {name: "abc", types: ["card", 101]},
        {name: "123", types: ["investment"]},
      ])
    })

    it("should filter when operator is 'hllt'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
        {name: "types", operator: "hllt", value: "2", active: true},
      ])

      expect(res).to.eql([
        {name: "foo", types: ["cash"]},
        {name: "baz", types: []},
        {name: "123", types: ["investment"]},
      ])
    })

    it("should filter when operator is 'hllte'", () => {
      const res = filter(mockDataForFiltering, mockSchema, [
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
