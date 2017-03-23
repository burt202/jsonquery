const chai = require("chai")
const expect = chai.expect

const dispatcher = require("../../src/js/helpers/dispatcher")
const store = require("../../src/js/store")

describe("store", function() {

  beforeEach(function() {
    expect(store.getState()).to.eql({
      filters: [],
      groupings: [],
      sortBy: null,
      sortDirection: "asc",
      schema: null,
      data: null,
      resultFields: null,
      showCounts: false,
      limit: null,
      sum: null,
      average: null,
    })

    dispatcher.dispatch({
      name: "saveJson",
      value: {name: "schema", data: {foo: "string"}},
    })
  })

  afterEach(function() {
    store.resetState()
  })

  describe("saveJson", function() {
    it("should save json under the passed prop name", function() {
      expect(store.getState().schema).to.eql({foo: "string"})
    })
  })

  describe("updateResultFields", function() {
    it("should save field names", function() {
      dispatcher.dispatch({
        name: "updateResultFields",
        value: {fields: ["foo"]},
      })

      expect(store.getState().resultFields).to.eql(["foo"])
    })
  })

  describe("addFilter", function() {
    it("should add filter", function() {
      dispatcher.dispatch({
        name: "addFilter",
        value: {name: "foo"},
      })

      expect(store.getState().filters).to.eql([{name: "foo", value: "", operator: "eq", active: true}])
    })
  })

  describe("deleteFilter", function() {
    beforeEach(function() {
      dispatcher.dispatch({
        name: "addFilter",
        value: {name: "foo"},
      })
    })

    it("should delete filter", function() {
      expect(store.getState().filters).to.eql([{name: "foo", value: "", operator: "eq", active: true}])

      dispatcher.dispatch({
        name: "deleteFilter",
        value: {name: "foo"},
      })

      expect(store.getState().filters).to.eql([])
    })
  })

  describe("updateFilter", function() {
    beforeEach(function() {
      dispatcher.dispatch({
        name: "addFilter",
        value: {name: "foo"},
      })
    })

    it("should update filter", function() {
      expect(store.getState().filters).to.eql([{name: "foo", value: "", operator: "eq", active: true}])

      dispatcher.dispatch({
        name: "updateFilter",
        value: {name: "foo", value: {value: "bar"}},
      })

      expect(store.getState().filters).to.eql([{name: "foo", value: "bar", operator: "eq", active: true}])
    })
  })

  describe("limit", function() {
    it("limit", function() {
      dispatcher.dispatch({
        name: "limit",
        value: {number: 2},
      })

      expect(store.getState().limit).to.eql(2)
    })
  })

  describe("reset", function() {
    beforeEach(function() {
      dispatcher.dispatch({
        name: "addFilter",
        value: {name: "foo"},
      })

      dispatcher.dispatch({
        name: "addGrouping",
        value: {name: "bar"},
      })

      dispatcher.dispatch({
        name: "sortDirection",
        value: {direction: "desc"},
      })
    })

    it("should reset filters, groupings and sortBy values to their defaults", function() {
      expect(store.getState().filters).to.eql([{name: "foo", value: "", operator: "eq", active: true}])
      expect(store.getState().groupings).to.eql(["bar"])
      expect(store.getState().sortDirection).to.eql("desc")

      dispatcher.dispatch({
        name: "reset",
        value: {},
      })

      expect(store.getState().filters).to.eql([])
      expect(store.getState().groupings).to.eql([])
      expect(store.getState().groupings).to.eql([])
      expect(store.getState().limit).to.eql(null)
      expect(store.getState().average).to.eql(null)
      expect(store.getState().sum).to.eql(null)
      expect(store.getState().sortDirection).to.eql("asc")
    })
  })

  describe("addGrouping", function() {
    it("should add groupings and nullify sum and average", function() {
      dispatcher.dispatch({
        name: "sum",
        value: {name: "bar"},
      })

      expect(store.getState().sum).to.eql("bar")

      dispatcher.dispatch({
        name: "average",
        value: {name: "baz"},
      })

      expect(store.getState().average).to.eql("baz")

      dispatcher.dispatch({
        name: "addGrouping",
        value: {name: "foo"},
      })

      expect(store.getState().groupings).to.eql(["foo"])
      expect(store.getState().sum).to.eql(null)
      expect(store.getState().average).to.eql(null)
    })

    it("should ensure groupings field is included in results", function() {
      dispatcher.dispatch({
        name: "updateResultFields",
        value: {fields: []},
      })

      expect(store.getState().resultFields).to.eql([])

      dispatcher.dispatch({
        name: "addGrouping",
        value: {name: "baz"},
      })

      expect(store.getState().groupings).to.eql(["baz"])
      expect(store.getState().resultFields).to.eql(["baz"])
    })

    it("should make sure result fields array contains unique values", function() {
      dispatcher.dispatch({
        name: "updateResultFields",
        value: {fields: ["foo", "bar"]},
      })

      expect(store.getState().resultFields).to.eql(["foo", "bar"])

      dispatcher.dispatch({
        name: "addGrouping",
        value: {name: "bar"},
      })

      expect(store.getState().groupings).to.eql(["bar"])
      expect(store.getState().resultFields).to.eql(["foo", "bar"])
    })
  })

  describe("removeGrouping", function() {
    it("should remove field from grouping", function() {
      dispatcher.dispatch({
        name: "addGrouping",
        value: {name: "baz"},
      })

      expect(store.getState().groupings).to.eql(["baz"])

      dispatcher.dispatch({
        name: "removeGrouping",
        value: {name: "baz"},
      })

      expect(store.getState().groupings).to.eql([])
    })

    it("should reset showCounts if groupings is deselected", function() {
      dispatcher.dispatch({
        name: "showCounts",
        value: {showCounts: true},
      })

      expect(store.getState().showCounts).to.eql(true)

      dispatcher.dispatch({
        name: "removeGrouping",
        value: {name: "baz"},
      })

      expect(store.getState().showCounts).to.eql(false)
    })
  })

  describe("sortBy", function() {
    it("should add sortBy prop", function() {
      dispatcher.dispatch({
        name: "addGrouping",
        value: {name: "bar"},
      })

      expect(store.getState().groupings).to.eql(["bar"])

      dispatcher.dispatch({
        name: "sortBy",
        value: {name: "foo"},
      })

      expect(store.getState().sortBy).to.eql("foo")
    })
  })

  describe("sortDirection", function() {
    it("should add sortDirection", function() {
      dispatcher.dispatch({
        name: "sortDirection",
        value: {direction: "foo"},
      })

      expect(store.getState().sortDirection).to.eql("foo")
    })
  })

  describe("goBack", function() {
    beforeEach(function() {
      dispatcher.dispatch({
        name: "addFilter",
        value: {name: "foo"},
      })

      dispatcher.dispatch({
        name: "addGrouping",
        value: {name: "bar"},
      })

      dispatcher.dispatch({
        name: "saveJson",
        value: {name: "schema", data: "baz"},
      })

      dispatcher.dispatch({
        name: "saveJson",
        value: {name: "data", data: "abc"},
      })
    })

    it("should reset filters and groupings values to their defaults", function() {
      expect(store.getState().filters).to.eql([{name: "foo", value: "", operator: "eq", active: true}])
      expect(store.getState().groupings).to.eql(["bar"])
      expect(store.getState().schema).to.eql("baz")
      expect(store.getState().data).to.eql("abc")

      dispatcher.dispatch({
        name: "goBack",
        value: {},
      })

      expect(store.getState()).to.eql({
        filters: [],
        groupings: [],
        sortBy: null,
        sortDirection: "asc",
        schema: null,
        data: null,
        resultFields: null,
        showCounts: false,
        limit: null,
        sum: null,
        average: null,
      })
    })
  })

  describe("showCounts", function() {
    it("should update showCounts", function() {
      dispatcher.dispatch({
        name: "showCounts",
        value: {showCounts: true},
      })

      expect(store.getState().showCounts).to.eql(true)
    })
  })

  describe("sum", function() {
    it("should add sum and nullify groupings and average", function() {
      dispatcher.dispatch({
        name: "addGrouping",
        value: {name: "bar"},
      })

      expect(store.getState().groupings).to.eql(["bar"])

      dispatcher.dispatch({
        name: "average",
        value: {name: "baz"},
      })

      expect(store.getState().average).to.eql("baz")

      dispatcher.dispatch({
        name: "sum",
        value: {name: "foo"},
      })

      expect(store.getState().sum).to.eql("foo")
      expect(store.getState().groupings).to.eql([])
      expect(store.getState().average).to.eql(null)
    })
  })

  describe("average", function() {
    it("should add sum and nullify groupings and sum", function() {
      dispatcher.dispatch({
        name: "addGrouping",
        value: {name: "bar"},
      })

      expect(store.getState().groupings).to.eql(["bar"])

      dispatcher.dispatch({
        name: "sum",
        value: {name: "baz"},
      })

      expect(store.getState().sum).to.eql("baz")

      dispatcher.dispatch({
        name: "average",
        value: {name: "foo"},
      })

      expect(store.getState().average).to.eql("foo")
      expect(store.getState().groupings).to.eql([])
      expect(store.getState().sum).to.eql(null)
    })
  })
})
