const chai = require("chai")
const expect = chai.expect

const formatter = require("../../../src/js/helpers/formatter")

describe("formatter", function() {

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
      const res = formatter.filter(mockDataForFiltering, mockSchema, [])

      expect(res).to.eql(mockDataForFiltering)
    })

    it("should filter on multiple fields", function() {
      const res = formatter.filter(mockDataForFiltering, mockSchema, [
        {name: "type", value: "cash", operator: "eq", active: true},
        {name: "deleted", operator: "false", active: true},
      ])

      expect(res).to.eql([
        {name: "bar", type: "cash", num: 2, deleted: false},
      ])
    })

    it("should filter on the same field multiple times", function() {
      const res = formatter.filter(mockDataForFiltering, mockSchema, [
        {name: "num", value: "1,2", operator: "iof", active: true},
        {name: "num", value: "2", operator: "lt", active: true},
      ])

      expect(res).to.eql([
        {name: "foo", type: "cash", num: 1, deleted: true},
      ])
    })

    it("should ignore inactive filters", function() {
      const res = formatter.filter(mockDataForFiltering, mockSchema, [
        {name: "type", value: "cash", operator: "eq", active: true},
        {name: "deleted", operator: "false", active: false},
      ])

      expect(res).to.eql([
        {name: "foo", type: "cash", num: 1, deleted: true},
        {name: "bar", type: "cash", num: 2, deleted: false},
      ])
    })

    it("should ignore invalid operators", function() {
      const res = formatter.filter(mockDataForFiltering, mockSchema, [
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

      it("should filter when operator is 'inof'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "type", operator: "inof", value: "cash,loan", active: true},
        ])

        expect(res).to.eql([
          {name: "abc", type: null},
          {name: "123", type: "card"},
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
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "eq", value: "102", active: true},
        ])

        expect(res).to.eql([
          {name: "bar", code: 102},
        ])
      })

      it("should filter when operator is 'neq'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
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
          {name: "456", code: 0},
        ])
      })

      it("should filter when operator is 'gt'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "gt", value: "102", active: true},
        ])

        expect(res).to.eql([
          {name: "baz", code: 103},
          {name: "abc", code: 103},
        ])
      })

      it("should filter when operator is 'lt'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "lt", value: "102", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", code: 101},
          {name: "123", code: null},
          {name: "456", code: 0},
        ])
      })

      it("should filter when operator is 'gte'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "gte", value: "102", active: true},
        ])

        expect(res).to.eql([
          {name: "bar", code: 102},
          {name: "baz", code: 103},
          {name: "abc", code: 103},
        ])
      })

      it("should filter when operator is 'lte'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
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
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "iof", value: "101,103", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", code: 101},
          {name: "baz", code: 103},
          {name: "abc", code: 103},
        ])
      })

      it("should filter when operator is 'iof' and one of the values is null", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "iof", value: "101,", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", code: 101},
          {name: "123", code: null},
        ])
      })

      it("should filter when operator is 'iof' and one of the values is 0", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "iof", value: "101,0", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", code: 101},
          {name: "456", code: 0},
        ])
      })

      it("should filter when operator is 'inof'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "code", operator: "inof", value: "101,103", active: true},
        ])

        expect(res).to.eql([
          {name: "bar", code: 102},
          {name: "123", code: null},
          {name: "456", code: 0},
        ])
      })

      it("should filter when operator is 'btw'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
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

        const res = formatter.filter(mockFilters, mockSchema, [
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

      it("should filter when not null", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
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
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "eq", value: "2016-07-11T17:16:27", active: true},
        ])

        expect(res).to.eql([
          {name: "123", dateCreated: "2016-07-11T17:16:27"},
        ])
      })

      it("should filter when operator is 'neq'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
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
          {name: "foo", dateCreated: "2016-09-11T17:16:27"},
          {name: "bar", dateCreated: "2016-08-11T17:16:27"},
          {name: "baz", dateCreated: "2016-06-11T17:16:27"},
          {name: "123", dateCreated: "2016-07-11T17:16:27"},
        ])
      })

      it("should filter when operator is 'sd'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "sd", value: "20160611", active: true},
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
          {name: "baz", dateCreated: "2016-06-11T17:16:27"},
          {name: "abc", dateCreated: null},
          {name: "123", dateCreated: "2016-07-11T17:16:27"},
        ])
      })

      it("should filter when operator is 'be' for datetime string", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
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
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "af", value: "20160712", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", dateCreated: "2016-09-11T17:16:27"},
          {name: "bar", dateCreated: "2016-08-11T17:16:27"},
        ])
      })

      it("should filter when operator is 'af' for datetime string", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "af", value: "20160711 0345", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", dateCreated: "2016-09-11T17:16:27"},
          {name: "bar", dateCreated: "2016-08-11T17:16:27"},
          {name: "123", dateCreated: "2016-07-11T17:16:27"},
        ])
      })

      it("should filter when operator is 'btw'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "btw", value: "20160712", value1: "20160910", active: true},
        ])

        expect(res).to.eql([
          {name: "bar", dateCreated: "2016-08-11T17:16:27"},
        ])
      })

      it("should filter when operator is 'btw' for datetime strings", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "dateCreated", operator: "btw", value: "20160711 0345", value1: "20160911 1854", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", dateCreated: "2016-09-11T17:16:27"},
          {name: "bar", dateCreated: "2016-08-11T17:16:27"},
          {name: "123", dateCreated: "2016-07-11T17:16:27"},
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
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "types", operator: "con", value: "101", active: true},
        ])

        expect(res).to.eql([
          {name: "abc", types: ["card", 101]},
        ])
      })

      it("should filter when operator is 'cos'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "types", operator: "cos", value: "card", active: true},
        ])

        expect(res).to.eql([
          {name: "bar", types: ["cash", "card"]},
          {name: "abc", types: ["card", 101]},
        ])
      })

      it("should filter when operator is 'hl'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "types", operator: "hl", value: "0", active: true},
        ])

        expect(res).to.eql([
          {name: "baz", types: []},
        ])
      })

      it("should filter when operator is 'dhl'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
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
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "types", operator: "hlgt", value: "1", active: true},
        ])

        expect(res).to.eql([
          {name: "bar", types: ["cash", "card"]},
          {name: "abc", types: ["card", 101]},
        ])
      })

      it("should filter when operator is 'hlgte'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
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
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
          {name: "types", operator: "hllt", value: "2", active: true},
        ])

        expect(res).to.eql([
          {name: "foo", types: ["cash"]},
          {name: "baz", types: []},
          {name: "123", types: ["investment"]},
        ])
      })

      it("should filter when operator is 'hllte'", function() {
        const res = formatter.filter(mockDataForFiltering, mockSchema, [
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
      expect(formatter.group(["type"], false, mockDataForGrouping)).to.eql({
        cash: [
          {
            name: "foo",
            type: "cash",
            auto: true,
          },
          {
            name: "bar",
            type: "cash",
            auto: false,
          },
        ],
        loan: [
          {
            name: "baz",
            type: "loan",
            auto: true,
          },
        ],
        card: [
          {
            name: "abc",
            type: "card",
            auto: true,
          },
          {
            name: "123",
            type: "card",
            auto: false,
          },
          {
            name: "test",
            type: "card",
            auto: true,
          },
        ],
      })
    })

    it("should group data at 2 levels", function() {
      expect(formatter.group(["type", "auto"], false, mockDataForGrouping)).to.eql({
        cash: {
          true: [
            {
              name: "foo",
              type: "cash",
              auto: true,
            },
          ],
          false: [
            {
              name: "bar",
              type: "cash",
              auto: false,
            },
          ],
        },
        loan: {
          true: [
            {
              name: "baz",
              type: "loan",
              auto: true,
            },
          ],
        },
        card: {
          true: [
            {
              name: "abc",
              type: "card",
              auto: true,
            },
            {
              name: "test",
              type: "card",
              auto: true,
            },
          ],
          false: [
            {
              name: "123",
              type: "card",
              auto: false,
            },
          ],
        },
      })
    })

    it("should group data with counts when 'showCounts' is true", function() {
      expect(formatter.group(["type"], true, mockDataForGrouping)).to.eql([
        "card: 3",
        "cash: 2",
        "loan: 1",
      ])
    })

    it("should group data with counts at 2 levels when 'showCounts' is true", function() {
      expect(formatter.group(["type", "auto"], true, mockDataForGrouping)).to.eql({
        cash: ["false: 1", "true: 1"],
        loan: ["true: 1"],
        card: ["true: 2", "false: 1"],
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

      expect(formatter.sort(sorters, mockDataForSorting)).to.eql([
        {artist: "Coldplay", album: "A Rush Of Blood", trackNo: 1},
        {artist: "Coldplay", album: "Parachutes", trackNo: 1},
        {artist: "Coldplay", album: "Parachutes", trackNo: 2},
        {artist: "Coldplay", album: "A Rush Of Blood", trackNo: 3},
        {artist: "Coldplay", album: "Parachutes", trackNo: 5},
      ])
    })

    it("should sort the data in descending order", function() {
      const sorters = [{field: "trackNo", direction: "desc"}]

      expect(formatter.sort(sorters, mockDataForSorting)).to.eql([
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

      expect(formatter.sort(sorters, mockDataForSorting)).to.eql([
        {artist: "Coldplay", album: "A Rush Of Blood", trackNo: 1},
        {artist: "Coldplay", album: "A Rush Of Blood", trackNo: 3},
        {artist: "Coldplay", album: "Parachutes", trackNo: 1},
        {artist: "Coldplay", album: "Parachutes", trackNo: 2},
        {artist: "Coldplay", album: "Parachutes", trackNo: 5},
      ])
    })
  })

  describe("getGroupStats", function() {
    describe("when there are no groups", function() {
      it("should return empty array", function() {
        const res = formatter.getGroupStats({})

        expect(res).to.eql([])
      })
    })

    describe("for 1 level of grouping", function() {
      var res

      beforeEach(function() {
        res = formatter.getGroupStats({foo: [1, 2, 3], bar: [1]})
      })

      it("should return the total number of groups", function() {
        expect(res[0]).to.eql({name: "No. of Groups", value: 2})
      })

      it("should return the size of the biggest group", function() {
        expect(res[1]).to.eql({name: "Max Group Size", value: 3})
      })

      it("should return the size of the smallest group", function() {
        expect(res[2]).to.eql({name: "Min Group Size", value: 1})
      })

      it("should return the mean average group size", function() {
        expect(res[3]).to.eql({name: "Average Group Size", value: 2})
      })
    })

    describe("for 2 levels of grouping", function() {
      var res

      beforeEach(function() {
        res = formatter.getGroupStats({foo: {a: [1]}, bar: {b: [1, 2], c: [1]}})
      })

      it("should return the total number of groups", function() {
        expect(res[0]).to.eql({name: "No. of Groups", value: 3})
      })

      it("should return the size of the biggest group", function() {
        expect(res[1]).to.eql({name: "Max Group Size", value: 2})
      })

      it("should return the size of the smallest group", function() {
        expect(res[2]).to.eql({name: "Min Group Size", value: 1})
      })

      it("should return the mean average group size", function() {
        expect(res[3]).to.eql({name: "Average Group Size", value: 1.33})
      })
    })
  })

  describe("round", function() {
    it("should round a number to a certain number of decimals", function() {
      const res = formatter.round(2, 1.3456)

      expect(res).to.eql(1.35)
    })
  })
})
