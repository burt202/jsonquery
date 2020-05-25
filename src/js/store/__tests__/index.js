const chai = require("chai")
const expect = chai.expect

const store = require("../index")

describe("store", () => {
  beforeEach(() => {
    expect(store.getState()).to.eql({
      filters: [],
      groupings: [],
      sorters: [],
      schema: null,
      data: null,
      resultFields: null,
      groupReducer: null,
      groupSort: "desc",
      groupLimit: null,
      limit: null,
      analyse: null,
      calculatedFields: [],
      calculationsString: null,
      combineRemainder: false,
      toast: undefined,
    })
  })

  afterEach(() => {
    store.dispatch({type: "_resetState"})
  })

  describe("saveJson", () => {
    it("should save json under the passed prop name", () => {
      store.dispatch({
        type: "saveJson",
        value: {name: "schema", data: {foo: "string"}},
      })

      expect(store.getState().schema).to.eql({foo: "string"})
    })

    it("should reset filters, groupings and sortBy values to their defaults", () => {
      store.dispatch({
        type: "_setState",
        value: {
          filters: [{id: 1, name: "foo", value: "", operator: "eq", active: true}],
          groupings: ["bar"],
          sorters: ["baz"],
          limit: "aaa",
          analyse: "bbb",
          groupReducer: {name: "count"},
        },
      })

      expect(store.getState().filters.length).to.eql(1)
      expect(store.getState().filters[0].name).to.eql("foo")
      expect(store.getState().groupings).to.eql(["bar"])
      expect(store.getState().sorters).to.eql(["baz"])
      expect(store.getState().limit).to.eql("aaa")
      expect(store.getState().analyse).to.eql("bbb")
      expect(store.getState().groupReducer).to.eql({name: "count"})

      store.dispatch({
        type: "saveJson",
        value: {name: "schema", data: {foo: "string"}},
      })

      expect(store.getState().filters).to.eql([])
      expect(store.getState().groupings).to.eql([])
      expect(store.getState().sorters).to.eql([])
      expect(store.getState().limit).to.eql(null)
      expect(store.getState().analyse).to.eql(null)
      expect(store.getState().groupReducer).to.eql(null)
    })
  })

  describe("updateResultFields", () => {
    it("should save field names", () => {
      store.dispatch({
        type: "updateResultFields",
        value: {fields: ["foo"]},
      })

      expect(store.getState().resultFields).to.eql(["foo"])
    })
  })

  describe("addFilter", () => {
    it("should add filter", () => {
      store.dispatch({
        type: "addFilter",
        value: {name: "foo"},
      })

      const filters = store.getState().filters
      expect(filters.length).to.eql(1)

      const filterJustAdded = filters[0]

      expect(filterJustAdded.id).to.be.a("string")
      delete filterJustAdded.id

      expect(filterJustAdded).to.eql({name: "foo", value: "", operator: "eq", active: true})
    })
  })

  describe("deleteFilter", () => {
    beforeEach(() => {
      store.dispatch({
        type: "_setState",
        value: {
          filters: [{id: 1, name: "foo", value: "", operator: "eq", active: true}],
        },
      })
    })

    it("should delete filter", () => {
      expect(store.getState().filters.length).to.eql(1)
      expect(store.getState().filters[0].name).to.eql("foo")

      store.dispatch({
        type: "deleteFilter",
        value: {id: 1},
      })

      expect(store.getState().filters).to.eql([])
    })
  })

  describe("updateFilter", () => {
    beforeEach(() => {
      store.dispatch({
        type: "_setState",
        value: {
          filters: [{id: 1, name: "foo", value: "", operator: "eq", active: true}],
        },
      })
    })

    it("should update filter", () => {
      expect(store.getState().filters.length).to.eql(1)
      expect(store.getState().filters[0].value).to.eql("")

      store.dispatch({
        type: "updateFilter",
        value: {id: 1, value: {value: "bar"}},
      })

      expect(store.getState().filters.length).to.eql(1)
      expect(store.getState().filters[0].value).to.eql("bar")
    })
  })

  describe("limit", () => {
    it("limit", () => {
      store.dispatch({
        type: "limit",
        value: {number: 2},
      })

      expect(store.getState().limit).to.eql(2)
    })
  })

  describe("reset", () => {
    beforeEach(() => {
      store.dispatch({
        type: "_setState",
        value: {
          filters: [{id: 1, name: "foo", value: "", operator: "eq", active: true}],
          groupings: ["bar"],
          sorters: ["baz"],
          groupReducer: {name: "count"},
          groupSort: "asc",
          groupLimit: 10,
          limit: "aaa",
          analyse: "bbb",
          calculatedFields: ["dd"],
          calculationsString: "ff",
          data: "data",
          schema: "schema",
          resultFields: "resultFields",
        },
      })
    })

    it("should reset filters, groupings and sortBy values to their defaults", () => {
      expect(store.getState().filters.length).to.eql(1)
      expect(store.getState().filters[0].name).to.eql("foo")
      expect(store.getState().groupings).to.eql(["bar"])
      expect(store.getState().sorters).to.eql(["baz"])
      expect(store.getState().groupReducer).to.eql({name: "count"})
      expect(store.getState().groupSort).to.eql("asc")
      expect(store.getState().groupLimit).to.eql(10)
      expect(store.getState().limit).to.eql("aaa")
      expect(store.getState().analyse).to.eql("bbb")

      store.dispatch({
        type: "reset",
        value: {},
      })

      expect(store.getState().filters).to.eql([])
      expect(store.getState().groupings).to.eql([])
      expect(store.getState().sorters).to.eql([])
      expect(store.getState().groupReducer).to.eql(null)
      expect(store.getState().groupSort).to.eql("desc")
      expect(store.getState().groupLimit).to.eql(null)
      expect(store.getState().limit).to.eql(null)
      expect(store.getState().analyse).to.eql(null)
    })

    it("should not reset some fields", () => {
      store.dispatch({
        type: "reset",
        value: {},
      })

      expect(store.getState().calculationsString).to.eql("ff")
      expect(store.getState().calculatedFields).to.eql(["dd"])
      expect(store.getState().data).to.eql("data")
      expect(store.getState().schema).to.eql("schema")
      expect(store.getState().resultFields).to.eql("resultFields")
    })
  })

  describe("addGrouping", () => {
    it("should add groupings and nullify analyse", () => {
      store.dispatch({
        type: "_setState",
        value: {
          analyse: "baz",
        },
      })

      expect(store.getState().analyse).to.eql("baz")

      store.dispatch({
        type: "addGrouping",
        value: {name: "foo"},
      })

      expect(store.getState().groupings).to.eql(["foo"])
      expect(store.getState().analyse).to.eql(null)
    })

    it("should ensure groupings field is included in results", () => {
      store.dispatch({
        type: "_setState",
        value: {
          resultFields: [],
        },
      })

      expect(store.getState().resultFields).to.eql([])

      store.dispatch({
        type: "addGrouping",
        value: {name: "baz"},
      })

      expect(store.getState().groupings).to.eql(["baz"])
      expect(store.getState().resultFields).to.eql(["baz"])
    })

    it("should make sure result fields array contains unique values", () => {
      store.dispatch({
        type: "_setState",
        value: {
          resultFields: ["foo", "bar"],
        },
      })

      expect(store.getState().resultFields).to.eql(["foo", "bar"])

      store.dispatch({
        type: "addGrouping",
        value: {name: "bar"},
      })

      expect(store.getState().groupings).to.eql(["bar"])
      expect(store.getState().resultFields).to.eql(["foo", "bar"])
    })
  })

  describe("removeGrouping", () => {
    it("should remove field from grouping", () => {
      store.dispatch({
        type: "_setState",
        value: {
          groupings: ["baz"],
        },
      })

      expect(store.getState().groupings).to.eql(["baz"])

      store.dispatch({
        type: "removeGrouping",
        value: {name: "baz"},
      })

      expect(store.getState().groupings).to.eql([])
    })

    it("should reset groupReducer, combineRemainder, groupSort and groupLimit if groupings is deselected", () => {
      store.dispatch({
        type: "_setState",
        value: {
          groupReducer: {name: "count"},
          groupSort: "asc",
          groupLimit: 10,
          groupings: ["baz"],
          combineRemainder: true,
        },
      })

      expect(store.getState().groupReducer).to.eql({name: "count"})
      expect(store.getState().groupSort).to.eql("asc")
      expect(store.getState().groupLimit).to.eql(10)
      expect(store.getState().combineRemainder).to.eql(true)

      store.dispatch({
        type: "removeGrouping",
        value: {name: "baz"},
      })

      expect(store.getState().groupReducer).to.eql(null)
      expect(store.getState().groupSort).to.eql("desc")
      expect(store.getState().groupLimit).to.eql(null)
      expect(store.getState().combineRemainder).to.eql(false)
    })

    it("should not reset groupReducer, combineRemainder, groupSort and groupLimit if groupings is still at least 1", () => {
      store.dispatch({
        type: "_setState",
        value: {
          groupReducer: {name: "count"},
          groupSort: "asc",
          groupLimit: 10,
          groupings: ["bar", "baz"],
          combineRemainder: true,
        },
      })

      expect(store.getState().groupReducer).to.eql({name: "count"})
      expect(store.getState().groupSort).to.eql("asc")
      expect(store.getState().groupLimit).to.eql(10)
      expect(store.getState().combineRemainder).to.eql(true)

      store.dispatch({
        type: "removeGrouping",
        value: {name: "baz"},
      })

      expect(store.getState().groupReducer).to.eql({name: "count"})
      expect(store.getState().groupSort).to.eql("asc")
      expect(store.getState().groupLimit).to.eql(10)
      expect(store.getState().combineRemainder).to.eql(true)
    })
  })

  describe("addSorter", () => {
    it("should add sorter", () => {
      store.dispatch({
        type: "addSorter",
        value: {sorter: {field: "foo", direction: "desc"}},
      })

      expect(store.getState().sorters).to.eql([{field: "foo", direction: "desc"}])
    })
  })

  describe("removeSorter", () => {
    it("should remove sorter", () => {
      store.dispatch({
        type: "_setState",
        value: {
          sorters: [{field: "foo", direction: "desc"}],
        },
      })

      store.dispatch({
        type: "removeSorter",
        value: {name: "foo"},
      })

      expect(store.getState().sorters).to.eql([])
    })
  })

  describe("groupReducer", () => {
    it("should update groupReducer", () => {
      store.dispatch({
        type: "groupReducer",
        value: {groupReducer: {name: "count"}},
      })

      expect(store.getState().groupReducer).to.eql({name: "count"})
    })

    it("should reset groupSort, groupLimit and combineRemainder when set to false", () => {
      store.dispatch({
        type: "_setState",
        value: {
          groupSort: "asc",
          groupLimit: 10,
          combineRemainder: true,
        },
      })

      expect(store.getState().groupSort).to.eql("asc")
      expect(store.getState().groupLimit).to.eql(10)
      expect(store.getState().combineRemainder).to.eql(true)

      store.dispatch({
        type: "groupReducer",
        value: {groupReducer: null},
      })

      expect(store.getState().groupReducer).to.eql(null)
      expect(store.getState().groupSort).to.eql("desc")
      expect(store.getState().groupLimit).to.eql(null)
      expect(store.getState().combineRemainder).to.eql(false)
    })
  })

  describe("groupReducerMeta", () => {
    it("should update groupReducer", () => {
      store.dispatch({
        type: "groupReducer",
        value: {groupReducer: {name: "count"}},
      })

      store.dispatch({
        type: "groupReducerMeta",
        value: {groupReducerMeta: {field: "foo"}},
      })

      expect(store.getState().groupReducer).to.eql({name: "count", field: "foo"})
    })
  })

  describe("analyse", () => {
    it("should add analyse and reset groupings, groupReducer, combineRemainder, groupSort and groupLimit", () => {
      store.dispatch({
        type: "_setState",
        value: {
          groupings: ["bar"],
          groupReducer: {name: "count"},
          groupSort: "asc",
          groupLimit: 10,
          combineRemainder: true,
        },
      })

      expect(store.getState().groupings).to.eql(["bar"])
      expect(store.getState().groupReducer).to.eql({name: "count"})
      expect(store.getState().groupSort).to.eql("asc")
      expect(store.getState().groupLimit).to.eql(10)
      expect(store.getState().combineRemainder).to.eql(true)

      store.dispatch({
        type: "analyse",
        value: {name: "foo"},
      })

      expect(store.getState().analyse).to.eql("foo")
      expect(store.getState().groupings).to.eql([])
      expect(store.getState().groupReducer).to.eql(null)
      expect(store.getState().groupSort).to.eql("desc")
      expect(store.getState().groupLimit).to.eql(null)
      expect(store.getState().combineRemainder).to.eql(false)
    })
  })

  describe("groupSort", () => {
    it("should add group sort", () => {
      store.dispatch({
        type: "groupSort",
        value: {groupSort: "foo"},
      })

      expect(store.getState().groupSort).to.eql("foo")
    })
  })

  describe("groupLimit", () => {
    it("should add group limit", () => {
      store.dispatch({
        type: "groupLimit",
        value: {groupLimit: "foo"},
      })

      expect(store.getState().groupLimit).to.eql("foo")
    })

    it("should add reset combineRemainder if group limit is unset", () => {
      store.dispatch({
        type: "_setState",
        value: {
          groupLimit: "foo",
          combineRemainder: true,
        },
      })

      store.dispatch({
        type: "groupLimit",
        value: {groupLimit: null},
      })

      expect(store.getState().combineRemainder).to.eql(false)
    })
  })

  describe("combineRemainder", () => {
    it("should add group limit", () => {
      store.dispatch({
        type: "combineRemainder",
        value: {combineRemainder: "foo"},
      })

      expect(store.getState().combineRemainder).to.eql("foo")
    })
  })

  describe("saveCalculatedFields", () => {
    it("should save calculated fields", () => {
      store.dispatch({
        type: "saveCalculatedFields",
        value: {calculatedFields: "foo"},
      })

      expect(store.getState().calculatedFields).to.eql("foo")
    })
  })

  describe("saveCalculationsString", () => {
    it("should save the calculation string", () => {
      store.dispatch({
        type: "saveCalculationsString",
        value: {calculationsString: "foo"},
      })

      expect(store.getState().calculationsString).to.eql("foo")
    })
  })
})
