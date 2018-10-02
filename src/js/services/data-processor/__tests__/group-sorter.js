const chai = require("chai")
const expect = chai.expect

const groupSorter = require("../group-sorter")

describe("groupSorter", function() {
  const mockDataForSorting = {
    "cash - true": {count: 1, reducer: 1},
    "loan - true": {count: 1, reducer: 1},
    "card - true": {count: 2, reducer: 2},
    "cash - false": {count: 1, reducer: 1},
    "card - false": {count: 1, reducer: 1},
  }

  it("should return passed in data if sortField is undefined", function() {
    expect(groupSorter(undefined, mockDataForSorting)).to.eql(mockDataForSorting)
  })

  it("should return object in order of count descending", function() {
    expect(groupSorter("desc", mockDataForSorting)).to.eql([
      {name: "card - true", reducer: 2},
      {name: "cash - true", reducer: 1},
      {name: "loan - true", reducer: 1},
      {name: "cash - false", reducer: 1},
      {name: "card - false", reducer: 1},
    ])
  })

  it("should return object in order of count ascending", function() {
    expect(groupSorter("asc", mockDataForSorting)).to.eql([
      {name: "cash - true", reducer: 1},
      {name: "loan - true", reducer: 1},
      {name: "cash - false", reducer: 1},
      {name: "card - false", reducer: 1},
      {name: "card - true", reducer: 2},
    ])
  })

  it("should return object in order of name descending", function() {
    expect(groupSorter("namedesc", mockDataForSorting)).to.eql([
      {name: "loan - true", reducer: 1},
      {name: "cash - true", reducer: 1},
      {name: "cash - false", reducer: 1},
      {name: "card - true", reducer: 2},
      {name: "card - false", reducer: 1},
    ])
  })

  it("should return object in order of name ascending", function() {
    expect(groupSorter("nameasc", mockDataForSorting)).to.eql([
      {name: "card - false", reducer: 1},
      {name: "card - true", reducer: 2},
      {name: "cash - false", reducer: 1},
      {name: "cash - true", reducer: 1},
      {name: "loan - true", reducer: 1},
    ])
  })

  it("should return object in order of path/count descending", function() {
    expect(groupSorter("pathdesc", mockDataForSorting)).to.eql([
      {name: "card - true", reducer: 2},
      {name: "card - false", reducer: 1},
      {name: "cash - true", reducer: 1},
      {name: "cash - false", reducer: 1},
      {name: "loan - true", reducer: 1},
    ])
  })

  it("should return object in order of path/count ascending", function() {
    expect(groupSorter("pathasc", mockDataForSorting)).to.eql([
      {name: "card - false", reducer: 1},
      {name: "card - true", reducer: 2},
      {name: "cash - true", reducer: 1},
      {name: "cash - false", reducer: 1},
      {name: "loan - true", reducer: 1},
    ])
  })

  it("should return object in order of reducer descending", function() {
    expect(groupSorter("reducerdesc", mockDataForSorting)).to.eql([
      {name: "card - true", reducer: 2},
      {name: "cash - true", reducer: 1},
      {name: "loan - true", reducer: 1},
      {name: "cash - false", reducer: 1},
      {name: "card - false", reducer: 1},
    ])
  })

  it("should return object in order of reducer ascending", function() {
    expect(groupSorter("reducerasc", mockDataForSorting)).to.eql([
      {name: "cash - true", reducer: 1},
      {name: "loan - true", reducer: 1},
      {name: "cash - false", reducer: 1},
      {name: "card - false", reducer: 1},
      {name: "card - true", reducer: 2},
    ])
  })

  it("should return object in natural order of full month name", function() {
    const data = {
      November: {count: 4081, reducer: 4081},
      April: {count: 5777, reducer: 5777},
      February: {count: 8836, reducer: 8836},
      March: {count: 8150, reducer: 8150},
      January: {count: 8595, reducer: 8595},
      October: {count: 3868, reducer: 3868},
      August: {count: 3581, reducer: 3581},
      July: {count: 4880, reducer: 4880},
      June: {count: 5506, reducer: 5506},
      December: {count: 5161, reducer: 5161},
      September: {count: 2418, reducer: 2418},
      May: {count: 6839, reducer: 6839},
    }

    expect(groupSorter("natural", data)).to.eql([
      {name: "January", reducer: 8595},
      {name: "February", reducer: 8836},
      {name: "March", reducer: 8150},
      {name: "April", reducer: 5777},
      {name: "May", reducer: 6839},
      {name: "June", reducer: 5506},
      {name: "July", reducer: 4880},
      {name: "August", reducer: 3581},
      {name: "September", reducer: 2418},
      {name: "October", reducer: 3868},
      {name: "November", reducer: 4081},
      {name: "December", reducer: 5161},
    ])
  })

  it("should return object in natural order of short month name", function() {
    const data = {
      Nov: {count: 4081, reducer: 4081},
      Apr: {count: 5777, reducer: 5777},
      Feb: {count: 8836, reducer: 8836},
      Mar: {count: 8150, reducer: 8150},
      Jan: {count: 8595, reducer: 8595},
      Oct: {count: 3868, reducer: 3868},
      Aug: {count: 3581, reducer: 3581},
      Jul: {count: 4880, reducer: 4880},
      Jun: {count: 5506, reducer: 5506},
      Dec: {count: 5161, reducer: 5161},
      Sep: {count: 2418, reducer: 2418},
      May: {count: 6839, reducer: 6839},
    }

    expect(groupSorter("natural", data)).to.eql([
      {name: "Jan", reducer: 8595},
      {name: "Feb", reducer: 8836},
      {name: "Mar", reducer: 8150},
      {name: "Apr", reducer: 5777},
      {name: "May", reducer: 6839},
      {name: "Jun", reducer: 5506},
      {name: "Jul", reducer: 4880},
      {name: "Aug", reducer: 3581},
      {name: "Sep", reducer: 2418},
      {name: "Oct", reducer: 3868},
      {name: "Nov", reducer: 4081},
      {name: "Dec", reducer: 5161},
    ])
  })

  it("should return object in natural order of full day name", function() {
    const data = {
      Friday: {count: 4081, reducer: 4081},
      Wednesday: {count: 5777, reducer: 5777},
      Saturday: {count: 8836, reducer: 8836},
      Tuesday: {count: 8150, reducer: 8150},
      Sunday: {count: 8595, reducer: 8595},
      Monday: {count: 3868, reducer: 3868},
      Thursday: {count: 3581, reducer: 3581},
    }

    expect(groupSorter("natural", data)).to.eql([
      {name: "Monday", reducer: 3868},
      {name: "Tuesday", reducer: 8150},
      {name: "Wednesday", reducer: 5777},
      {name: "Thursday", reducer: 3581},
      {name: "Friday", reducer: 4081},
      {name: "Saturday", reducer: 8836},
      {name: "Sunday", reducer: 8595},
    ])
  })

  it("should return object in natural order of short day name", function() {
    const data = {
      Fri: {count: 4081, reducer: 4081},
      Wed: {count: 5777, reducer: 5777},
      Sat: {count: 8836, reducer: 8836},
      Tue: {count: 8150, reducer: 8150},
      Sun: {count: 8595, reducer: 8595},
      Mon: {count: 3868, reducer: 3868},
      Thu: {count: 3581, reducer: 3581},
    }

    expect(groupSorter("natural", data)).to.eql([
      {name: "Mon", reducer: 3868},
      {name: "Tue", reducer: 8150},
      {name: "Wed", reducer: 5777},
      {name: "Thu", reducer: 3581},
      {name: "Fri", reducer: 4081},
      {name: "Sat", reducer: 8836},
      {name: "Sun", reducer: 8595},
    ])
  })

  it("should sort name descending naturally if all numbers", function() {
    const data = {
      "52": {count: 4081, reducer: 4081},
      "100": {count: 5777, reducer: 5777},
      "89": {count: 8836, reducer: 8836},
      "2": {count: 8150, reducer: 8150},
      "22.4": {count: 8595, reducer: 8595},
      "37.89": {count: 3868, reducer: 3868},
      "10": {count: 3581, reducer: 3581},
    }

    expect(groupSorter("namedesc", data)).to.eql([
      {name: 100, reducer: 5777},
      {name: 89, reducer: 8836},
      {name: 52, reducer: 4081},
      {name: 37.89, reducer: 3868},
      {name: 22.4, reducer: 8595},
      {name: 10, reducer: 3581},
      {name: 2, reducer: 8150},
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
