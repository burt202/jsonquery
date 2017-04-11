const chai = require("chai")
const expect = chai.expect

const dispatcher = require("../../src/js/helpers/dispatcher")
const store = require("../../src/js/store")

describe("store", function() {

  beforeEach(function() {
    expect(store.getState()).to.eql({
      filters: [],
      groupings: [],
      sorters: [],
      schema: null,
      data: null,
      resultFields: null,
      showCounts: false,
      limit: null,
      sum: null,
      average: null,
    })
  })

  afterEach(function() {
    store.resetState()
  })

  describe("saveJson", function() {
    it("should save json under the passed prop name", function() {
      dispatcher.dispatch({
        name: "saveJson",
        value: {name: "schema", data: {foo: "string"}},
      })

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

      const filters = store.getState().filters
      expect(filters.length).to.eql(1)

      const filterJustAdded = filters[0]

      expect(filterJustAdded.id).to.be.a("string")
      delete filterJustAdded.id

      expect(filterJustAdded).to.eql({name: "foo", value: "", operator: "eq", active: true})
    })
  })

  describe("deleteFilter", function() {
    beforeEach(function() {
      store.setState({filters: [{id: 1, name: "foo", value: "", operator: "eq", active: true}]})
    })

    it("should delete filter", function() {
      expect(store.getState().filters.length).to.eql(1)
      expect(store.getState().filters[0].name).to.eql("foo")

      dispatcher.dispatch({
        name: "deleteFilter",
        value: {id: 1},
      })

      expect(store.getState().filters).to.eql([])
    })
  })

  describe("updateFilter", function() {
    beforeEach(function() {
      store.setState({filters: [{id: 1, name: "foo", value: "", operator: "eq", active: true}]})
    })

    it("should update filter", function() {
      expect(store.getState().filters.length).to.eql(1)
      expect(store.getState().filters[0].value).to.eql("")

      dispatcher.dispatch({
        name: "updateFilter",
        value: {id: 1, value: {value: "bar"}},
      })

      expect(store.getState().filters.length).to.eql(1)
      expect(store.getState().filters[0].value).to.eql("bar")
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
      store.setState({
        filters: [{id: 1, name: "foo", value: "", operator: "eq", active: true}],
        groupings: ["bar"],
        sorters: ["baz"],
        limit: "aaa",
        average: "bbb",
        sum: "ccc",
        showCounts: true,
      })
    })

    it("should reset filters, groupings and sortBy values to their defaults", function() {
      expect(store.getState().filters.length).to.eql(1)
      expect(store.getState().filters[0].name).to.eql("foo")
      expect(store.getState().groupings).to.eql(["bar"])
      expect(store.getState().sorters).to.eql(["baz"])
      expect(store.getState().limit).to.eql("aaa")
      expect(store.getState().average).to.eql("bbb")
      expect(store.getState().sum).to.eql("ccc")
      expect(store.getState().showCounts).to.eql(true)

      dispatcher.dispatch({
        name: "reset",
        value: {},
      })

      expect(store.getState().filters).to.eql([])
      expect(store.getState().groupings).to.eql([])
      expect(store.getState().sorters).to.eql([])
      expect(store.getState().limit).to.eql(null)
      expect(store.getState().average).to.eql(null)
      expect(store.getState().sum).to.eql(null)
      expect(store.getState().showCounts).to.eql(false)
    })
  })

  describe("addGrouping", function() {
    it("should add groupings and nullify sum and average", function() {
      store.setState({sum: "bar", average: "baz"})

      expect(store.getState().sum).to.eql("bar")
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
      store.setState({resultFields: []})

      expect(store.getState().resultFields).to.eql([])

      dispatcher.dispatch({
        name: "addGrouping",
        value: {name: "baz"},
      })

      expect(store.getState().groupings).to.eql(["baz"])
      expect(store.getState().resultFields).to.eql(["baz"])
    })

    it("should make sure result fields array contains unique values", function() {
      store.setState({resultFields: ["foo", "bar"]})

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
      store.setState({groupings: ["baz"]})

      expect(store.getState().groupings).to.eql(["baz"])

      dispatcher.dispatch({
        name: "removeGrouping",
        value: {name: "baz"},
      })

      expect(store.getState().groupings).to.eql([])
    })

    it("should reset showCounts if groupings is deselected", function() {
      store.setState({showCounts: true})

      expect(store.getState().showCounts).to.eql(true)

      dispatcher.dispatch({
        name: "removeGrouping",
        value: {name: "baz"},
      })

      expect(store.getState().showCounts).to.eql(false)
    })
  })

  describe("addSorter", function() {
    it("should add sorter", function() {
      dispatcher.dispatch({
        name: "addSorter",
        value: {sorter: {field: "foo", direction: "desc"}},
      })

      expect(store.getState().sorters).to.eql([{field: "foo", direction: "desc"}])
    })
  })

  describe("removeSorter", function() {
    it("should remove sorter", function() {
      store.setState({sorters: [{field: "foo", direction: "desc"}]})

      dispatcher.dispatch({
        name: "removeSorter",
        value: {name: "foo"},
      })

      expect(store.getState().sorters).to.eql([])
    })
  })

  describe("goBack", function() {
    it("should reset everything to their defaults", function() {
      store.setState({foo: "bar"})

      dispatcher.dispatch({
        name: "goBack",
        value: {},
      })

      expect(store.getState()).to.eql({
        filters: [],
        groupings: [],
        sorters: [],
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
      store.setState({groupings: ["bar"], average: "baz"})

      expect(store.getState().groupings).to.eql(["bar"])
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
      store.setState({groupings: ["bar"], sum: "baz"})

      expect(store.getState().groupings).to.eql(["bar"])
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
