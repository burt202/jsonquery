const chai = require("chai")
const expect = chai.expect

const groupFilterer = require("../group-filterer")

describe("groupFilterer", function() {
  const mockDataForGrouping = {
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
  }

  it("should return passed in data if filter is undefined", function() {
    expect(groupFilterer(undefined, mockDataForGrouping)).to.eql(mockDataForGrouping)
  })

  it("should return groups with length = 3", function() {
    expect(groupFilterer({operator: "eq", value: 3}, mockDataForGrouping)).to.eql({
      card: [
        {name: "abc", type: "card", auto: true},
        {name: "123", type: "card", auto: false},
        {name: "test", type: "card", auto: true},
      ],
    })
  })

  it("should return groups with length < 3", function() {
    expect(groupFilterer({operator: "lt", value: 3}, mockDataForGrouping)).to.eql({
      cash: [
        {name: "foo", type: "cash", auto: true},
        {name: "bar", type: "cash", auto: false},
      ],
      loan: [
        {name: "baz", type: "loan", auto: true},
      ],
    })
  })

  it("should return groups with length <= 3", function() {
    expect(groupFilterer({operator: "lte", value: 3}, mockDataForGrouping)).to.eql({
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

  it("should return groups with length > 1", function() {
    expect(groupFilterer({operator: "gt", value: 1}, mockDataForGrouping)).to.eql({
      cash: [
        {name: "foo", type: "cash", auto: true},
        {name: "bar", type: "cash", auto: false},
      ],
      card: [
        {name: "abc", type: "card", auto: true},
        {name: "123", type: "card", auto: false},
        {name: "test", type: "card", auto: true},
      ],
    })
  })

  it("should return groups with length >= 2", function() {
    expect(groupFilterer({operator: "gte", value: 2}, mockDataForGrouping)).to.eql({
      cash: [
        {name: "foo", type: "cash", auto: true},
        {name: "bar", type: "cash", auto: false},
      ],
      card: [
        {name: "abc", type: "card", auto: true},
        {name: "123", type: "card", auto: false},
        {name: "test", type: "card", auto: true},
      ],
    })
  })
})
