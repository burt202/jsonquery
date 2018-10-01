const chai = require("chai")
const expect = chai.expect

const groupSorter = require("../group-sorter")

describe("groupSorter", function() {
  const mockDataForSorting = {
    "cash - true": {count: 1},
    "loan - true": {count: 1},
    "card - true": {count: 2},
    "cash - false": {count: 1},
    "card - false": {count: 1},
  }

  it("should return passed in data if sortField is undefined", function() {
    expect(groupSorter(undefined, mockDataForSorting)).to.eql(mockDataForSorting)
  })

  it("should return object in order of count descending", function() {
    expect(groupSorter("desc", mockDataForSorting)).to.eql([
      {name: "card - true", count: 2},
      {name: "cash - true", count: 1},
      {name: "loan - true", count: 1},
      {name: "cash - false", count: 1},
      {name: "card - false", count: 1},
    ])
  })

  it("should return object in order of count ascending", function() {
    expect(groupSorter("asc", mockDataForSorting)).to.eql([
      {name: "cash - true", count: 1},
      {name: "loan - true", count: 1},
      {name: "cash - false", count: 1},
      {name: "card - false", count: 1},
      {name: "card - true", count: 2},
    ])
  })

  it("should return object in order of name descending", function() {
    expect(groupSorter("namedesc", mockDataForSorting)).to.eql([
      {name: "loan - true", count: 1},
      {name: "cash - true", count: 1},
      {name: "cash - false", count: 1},
      {name: "card - true", count: 2},
      {name: "card - false", count: 1},
    ])
  })

  it("should return object in order of name ascending", function() {
    expect(groupSorter("nameasc", mockDataForSorting)).to.eql([
      {name: "card - false", count: 1},
      {name: "card - true", count: 2},
      {name: "cash - false", count: 1},
      {name: "cash - true", count: 1},
      {name: "loan - true", count: 1},
    ])
  })

  it("should return object in order of path/count descending", function() {
    expect(groupSorter("pathdesc", mockDataForSorting)).to.eql([
      {name: "card - true", count: 2},
      {name: "card - false", count: 1},
      {name: "cash - true", count: 1},
      {name: "cash - false", count: 1},
      {name: "loan - true", count: 1},
    ])
  })

  it("should return object in order of path/count ascending", function() {
    expect(groupSorter("pathasc", mockDataForSorting)).to.eql([
      {name: "card - false", count: 1},
      {name: "card - true", count: 2},
      {name: "cash - true", count: 1},
      {name: "cash - false", count: 1},
      {name: "loan - true", count: 1},
    ])
  })

  it("should return object in natural order of full month name", function() {
    const data = {
      November: {count: 4081},
      April: {count: 5777},
      February: {count: 8836},
      March: {count: 8150},
      January: {count: 8595},
      October: {count: 3868},
      August: {count: 3581},
      July: {count: 4880},
      June: {count: 5506},
      December: {count: 5161},
      September: {count: 2418},
      May: {count: 6839},
    }

    expect(groupSorter("natural", data)).to.eql([
      {name: "January", count: 8595},
      {name: "February", count: 8836},
      {name: "March", count: 8150},
      {name: "April", count: 5777},
      {name: "May", count: 6839},
      {name: "June", count: 5506},
      {name: "July", count: 4880},
      {name: "August", count: 3581},
      {name: "September", count: 2418},
      {name: "October", count: 3868},
      {name: "November", count: 4081},
      {name: "December", count: 5161},
    ])
  })

  it("should return object in natural order of short month name", function() {
    const data = {
      Nov: {count: 4081},
      Apr: {count: 5777},
      Feb: {count: 8836},
      Mar: {count: 8150},
      Jan: {count: 8595},
      Oct: {count: 3868},
      Aug: {count: 3581},
      Jul: {count: 4880},
      Jun: {count: 5506},
      Dec: {count: 5161},
      Sep: {count: 2418},
      May: {count: 6839},
    }

    expect(groupSorter("natural", data)).to.eql([
      {name: "Jan", count: 8595},
      {name: "Feb", count: 8836},
      {name: "Mar", count: 8150},
      {name: "Apr", count: 5777},
      {name: "May", count: 6839},
      {name: "Jun", count: 5506},
      {name: "Jul", count: 4880},
      {name: "Aug", count: 3581},
      {name: "Sep", count: 2418},
      {name: "Oct", count: 3868},
      {name: "Nov", count: 4081},
      {name: "Dec", count: 5161},
    ])
  })

  it("should return object in natural order of full day name", function() {
    const data = {
      Friday: {count: 4081},
      Wednesday: {count: 5777},
      Saturday: {count: 8836},
      Tuesday: {count: 8150},
      Sunday: {count: 8595},
      Monday: {count: 3868},
      Thursday: {count: 3581},
    }

    expect(groupSorter("natural", data)).to.eql([
      {name: "Monday", count: 3868},
      {name: "Tuesday", count: 8150},
      {name: "Wednesday", count: 5777},
      {name: "Thursday", count: 3581},
      {name: "Friday", count: 4081},
      {name: "Saturday", count: 8836},
      {name: "Sunday", count: 8595},
    ])
  })

  it("should return object in natural order of short day name", function() {
    const data = {
      Fri: {count: 4081},
      Wed: {count: 5777},
      Sat: {count: 8836},
      Tue: {count: 8150},
      Sun: {count: 8595},
      Mon: {count: 3868},
      Thu: {count: 3581},
    }

    expect(groupSorter("natural", data)).to.eql([
      {name: "Mon", count: 3868},
      {name: "Tue", count: 8150},
      {name: "Wed", count: 5777},
      {name: "Thu", count: 3581},
      {name: "Fri", count: 4081},
      {name: "Sat", count: 8836},
      {name: "Sun", count: 8595},
    ])
  })

  it("should sort name descending naturally if all numbers", function() {
    const data = {
      "52": {count: 4081},
      "100": {count: 5777},
      "89": {count: 8836},
      "2": {count: 8150},
      "22.4": {count: 8595},
      "37.89": {count: 3868},
      "10": {count: 3581},
    }

    expect(groupSorter("namedesc", data)).to.eql([
      {name: 100, count: 5777},
      {name: 89, count: 8836},
      {name: 52, count: 4081},
      {name: 37.89, count: 3868},
      {name: 22.4, count: 8595},
      {name: 10, count: 3581},
      {name: 2, count: 8150},
    ])
  })

  it("should return error when no matcher is found for data", function() {
    const data = {
      "52": {count: 4081},
      "100": {count: 5777},
      "89": {count: 8836},
      "2": {count: 8150},
      "22.4": {count: 8595},
      "37.89": {count: 3868},
      "10": {count: 3581},
    }

    expect(groupSorter("natural", data)).to.be.a("string")
  })
})
