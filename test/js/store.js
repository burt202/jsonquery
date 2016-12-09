const chai = require("chai")
const expect = chai.expect

const dispatcher = require("../../src/js/helpers/dispatcher")
const store = require("../../src/js/store")

describe("store", function() {

  beforeEach(function() {
    expect(store.getState()).to.eql({
      filters: [],
      groupBy: null,
      sortBy: null,
      sortDirection: "asc",
      schema: null,
      data: null,
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

  describe("addFilter", function() {
    it("should add filter", function() {
      dispatcher.dispatch({
        name: "addFilter",
        value: {name: "foo"},
      })

      expect(store.getState().filters).to.eql([{name: "foo", value: "", operator: "eq"}])
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
      expect(store.getState().filters).to.eql([{name: "foo", value: "", operator: "eq"}])

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
      expect(store.getState().filters).to.eql([{name: "foo", value: "", operator: "eq"}])

      dispatcher.dispatch({
        name: "updateFilter",
        value: {name: "foo", value: {value: "bar"}},
      })

      expect(store.getState().filters).to.eql([{name: "foo", value: "bar", operator: "eq"}])
    })
  })

  describe("reset", function() {
    beforeEach(function() {
      dispatcher.dispatch({
        name: "addFilter",
        value: {name: "foo"},
      })

      dispatcher.dispatch({
        name: "groupBy",
        value: {name: "bar"},
      })
    })

    it("should reset filters and groupBy values to their defaults", function() {
      expect(store.getState().filters).to.eql([{name: "foo", value: "", operator: "eq"}])
      expect(store.getState().groupBy).to.eql("bar")

      dispatcher.dispatch({
        name: "reset",
        value: {},
      })

      expect(store.getState().filters).to.eql([])
      expect(store.getState().groupBy).to.eql(null)
    })
  })

  describe("groupBy", function() {
    it("should add groupBy and nullify sortBy prop", function() {
      dispatcher.dispatch({
        name: "sortBy",
        value: {name: "bar"},
      })

      expect(store.getState().sortBy).to.eql("bar")

      dispatcher.dispatch({
        name: "groupBy",
        value: {name: "foo"},
      })

      expect(store.getState().groupBy).to.eql("foo")
      expect(store.getState().sortBy).to.eql(null)
    })
  })

  describe("sortBy", function() {
    it("should add sortBy and nullify groupBy prop", function() {
      dispatcher.dispatch({
        name: "groupBy",
        value: {name: "bar"},
      })

      expect(store.getState().groupBy).to.eql("bar")

      dispatcher.dispatch({
        name: "sortBy",
        value: {name: "foo"},
      })

      expect(store.getState().sortBy).to.eql("foo")
      expect(store.getState().groupBy).to.eql(null)
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
        name: "groupBy",
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

    it("should reset filters and groupBy values to their defaults", function() {
      expect(store.getState().filters).to.eql([{name: "foo", value: "", operator: "eq"}])
      expect(store.getState().groupBy).to.eql("bar")
      expect(store.getState().schema).to.eql("baz")
      expect(store.getState().data).to.eql("abc")

      dispatcher.dispatch({
        name: "goBack",
        value: {},
      })

      expect(store.getState()).to.eql({
        filters: [],
        groupBy: null,
        sortBy: null,
        sortDirection: "asc",
        schema: null,
        data: null,
      })
    })
  })
})
