const chai = require("chai")
const expect = chai.expect

const groupReducer = require("../group-reducer")

describe("groupReducer", () => {
  const mockDataForGrouping = {
    cash: [
      {name: "foo", type: "cash", auto: true},
      {name: "bar", type: "cash", auto: false},
    ],
    loan: [{name: "baz", type: "loan", auto: true}],
    card: [
      {name: "abc", type: "card", auto: true},
      {name: "123", type: "card", auto: false},
      {name: "test", type: "card", auto: true},
    ],
  }

  it("should return passed in data if reducer is undefined", () => {
    expect(groupReducer({}, undefined, mockDataForGrouping)).to.eql(mockDataForGrouping)
  })

  it("should return passed in data if reducer name is not recognised", () => {
    expect(groupReducer({}, {name: "invalid"}, mockDataForGrouping)).to.eql(mockDataForGrouping)
  })

  describe("count", () => {
    it("should reduce group down to length of group", () => {
      expect(groupReducer({}, {name: "count"}, mockDataForGrouping)).to.eql({
        card: {count: 3, reducer: 3},
        cash: {count: 2, reducer: 2},
        loan: {count: 1, reducer: 1},
      })
    })
  })

  describe("percentage", () => {
    it("should reduce group down to percentage of group size against total items", () => {
      expect(groupReducer({}, {name: "percentage"}, mockDataForGrouping)).to.eql({
        card: {count: 3, reducer: 50},
        cash: {count: 2, reducer: 33.33},
        loan: {count: 1, reducer: 16.67},
      })
    })
  })

  describe("countCondition", () => {
    it("should reduce group down to count based on a condition", () => {
      expect(
        groupReducer(
          {auto: "bool"},
          {name: "countCondition", field: "auto", value: "true"},
          mockDataForGrouping,
        ),
      ).to.eql({
        card: {count: 3, reducer: 2},
        cash: {count: 2, reducer: 1},
        loan: {count: 1, reducer: 1},
      })
    })

    it("should return 'N/A' when field or value is not present", () => {
      expect(groupReducer({}, {name: "countCondition"}, mockDataForGrouping)).to.eql({
        card: {count: 3, reducer: "N/A"},
        cash: {count: 2, reducer: "N/A"},
        loan: {count: 1, reducer: "N/A"},
      })
    })
  })

  describe("percentageCondition", () => {
    it("should reduce group down to count based on a condition", () => {
      expect(
        groupReducer(
          {auto: "bool"},
          {name: "percentageCondition", field: "auto", value: "true"},
          mockDataForGrouping,
        ),
      ).to.eql({
        card: {count: 3, reducer: 66.67},
        cash: {count: 2, reducer: 50},
        loan: {count: 1, reducer: 100},
      })
    })

    it("should return 'N/A' when field or value is not present", () => {
      expect(groupReducer({}, {name: "percentageCondition"}, mockDataForGrouping)).to.eql({
        card: {count: 3, reducer: "N/A"},
        cash: {count: 2, reducer: "N/A"},
        loan: {count: 1, reducer: "N/A"},
      })
    })
  })
})
