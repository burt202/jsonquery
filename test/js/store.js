var chai = require("chai");
var expect = chai.expect;

var dispatcher = require("../../src/js/helpers/dispatcher");
var store = require("../../src/js/store");

describe("store", function () {

  beforeEach(function () {
    expect(store.getState()).to.eql({
      filters: [],
      groupBy: null,
      schema: null,
      data: null
    });
  });

  afterEach(function () {
    store.resetState();
  });

  describe("saveJson", function () {
    it("should save json under the passed prop name", function () {
      dispatcher.dispatch({
        name: "saveJson",
        value: {name: "schema", data: "foo"}
      });

      expect(store.getState().schema).to.eql("foo");
    });
  });

  describe("addFilter", function () {
    it("should add filter", function () {
      dispatcher.dispatch({
        name: "addFilter",
        value: {name: "foo"}
      });

      expect(store.getState().filters).to.eql([{name: "foo", value: ""}]);
    });
  });

  describe("deleteFilter", function () {
    beforeEach(function () {
      dispatcher.dispatch({
        name: "addFilter",
        value: {name: "foo"}
      });
    });

    it("should delete filter", function () {
      expect(store.getState().filters).to.eql([{name: "foo", value: ""}]);

      dispatcher.dispatch({
        name: "deleteFilter",
        value: {name: "foo"}
      });

      expect(store.getState().filters).to.eql([]);
    });
  });

  describe("updateFilter", function () {
    beforeEach(function () {
      dispatcher.dispatch({
        name: "addFilter",
        value: {name: "foo"}
      });
    });

    it("should update filter", function () {
      expect(store.getState().filters).to.eql([{name: "foo", value: ""}]);

      dispatcher.dispatch({
        name: "updateFilter",
        value: {name: "foo", value: "bar"}
      });

      expect(store.getState().filters).to.eql([{name: "foo", value: "bar"}]);
    });
  });

  describe("reset", function () {
    beforeEach(function () {
      dispatcher.dispatch({
        name: "addFilter",
        value: {name: "foo"}
      });

      dispatcher.dispatch({
        name: "groupBy",
        value: {name: "bar"}
      });
    });

    it("should reset filters and groupBy values to their defaults", function () {
      expect(store.getState().filters).to.eql([{name: "foo", value: ""}]);
      expect(store.getState().groupBy).to.eql("bar");

      dispatcher.dispatch({
        name: "reset",
        value: {}
      });

      expect(store.getState().filters).to.eql([]);
      expect(store.getState().groupBy).to.eql(null);
    });
  });

  describe("groupBy", function () {
    it("should add groupBy", function () {
      dispatcher.dispatch({
        name: "groupBy",
        value: {name: "foo"}
      });

      expect(store.getState().groupBy).to.eql("foo");
    });
  });

  describe("goBack", function () {
    beforeEach(function () {
      dispatcher.dispatch({
        name: "addFilter",
        value: {name: "foo"}
      });

      dispatcher.dispatch({
        name: "groupBy",
        value: {name: "bar"}
      });

      dispatcher.dispatch({
        name: "saveJson",
        value: {name: "schema", data: "baz"}
      });

      dispatcher.dispatch({
        name: "saveJson",
        value: {name: "data", data: "abc"}
      });
    });

    it("should reset filters and groupBy values to their defaults", function () {
      expect(store.getState().filters).to.eql([{name: "foo", value: ""}]);
      expect(store.getState().groupBy).to.eql("bar");
      expect(store.getState().schema).to.eql("baz");
      expect(store.getState().data).to.eql("abc");

      dispatcher.dispatch({
        name: "goBack",
        value: {}
      });

      expect(store.getState()).to.eql({
        filters: [],
        groupBy: null,
        schema: null,
        data: null
      });
    });
  });
});
