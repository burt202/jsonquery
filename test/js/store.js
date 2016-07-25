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
      expect(store.getState().schema).to.eql(null);

      dispatcher.dispatch({
        name: "saveJson",
        value: {name: "schema", data: "foo"}
      });

      expect(store.getState().schema).to.eql("foo");
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
});
