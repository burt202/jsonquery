const chai = require("chai")
const expect = chai.expect

const groupProcessor = require("../group-processor")

describe("group processor", function() {
  const mockDataForSorting = {
    "cash - true": 1,
    "loan - true": 1,
    "card - true": 2,
    "cash - false": 1,
    "card - false": 1,
  }

  it("should return object in order of count descending", function() {
    expect(groupProcessor("desc", null, false, mockDataForSorting)).to.eql([
      {name: "card - true", count: 2, percentage: 33.33},
      {name: "cash - true", count: 1, percentage: 16.67},
      {name: "loan - true", count: 1, percentage: 16.67},
      {name: "cash - false", count: 1, percentage: 16.67},
      {name: "card - false", count: 1, percentage: 16.67},
    ])
  })

  it("should return object in order of count descending limited by number", function() {
    expect(groupProcessor("desc", 3, false, mockDataForSorting)).to.eql([
      {name: "card - true", count: 2, percentage: 50},
      {name: "cash - true", count: 1, percentage: 25},
      {name: "loan - true", count: 1, percentage: 25},
    ])
  })

  it("should return object in order of count ascending", function() {
    expect(groupProcessor("asc", null, false, mockDataForSorting)).to.eql([
      {name: "cash - true", count: 1, percentage: 16.67},
      {name: "loan - true", count: 1, percentage: 16.67},
      {name: "cash - false", count: 1, percentage: 16.67},
      {name: "card - false", count: 1, percentage: 16.67},
      {name: "card - true", count: 2, percentage: 33.33},
    ])
  })

  it("should return object in order of count ascending limited by number", function() {
    expect(groupProcessor("asc", 3, false, mockDataForSorting)).to.eql([
      {name: "cash - true", count: 1, percentage: 33.33},
      {name: "loan - true", count: 1, percentage: 33.33},
      {name: "cash - false", count: 1, percentage: 33.33},
    ])
  })

  it("should return object in order of name descending", function() {
    expect(groupProcessor("namedesc", null, false, mockDataForSorting)).to.eql([
      {name: "loan - true", count: 1, percentage: 16.67},
      {name: "cash - true", count: 1, percentage: 16.67},
      {name: "cash - false", count: 1, percentage: 16.67},
      {name: "card - true", count: 2, percentage: 33.33},
      {name: "card - false", count: 1, percentage: 16.67},
    ])
  })

  it("should return object in order of name descending limited by number", function() {
    expect(groupProcessor("namedesc", 3, false, mockDataForSorting)).to.eql([
      {name: "loan - true", count: 1, percentage: 33.33},
      {name: "cash - true", count: 1, percentage: 33.33},
      {name: "cash - false", count: 1, percentage: 33.33},
    ])
  })

  it("should return object in order of name ascending", function() {
    expect(groupProcessor("nameasc", null, false, mockDataForSorting)).to.eql([
      {name: "card - false", count: 1, percentage: 16.67},
      {name: "card - true", count: 2, percentage: 33.33},
      {name: "cash - false", count: 1, percentage: 16.67},
      {name: "cash - true", count: 1, percentage: 16.67},
      {name: "loan - true", count: 1, percentage: 16.67},
    ])
  })

  it("should return object in order of name ascending limited by number", function() {
    expect(groupProcessor("nameasc", 3, false, mockDataForSorting)).to.eql([
      {name: "card - false", count: 1, percentage: 25},
      {name: "card - true", count: 2, percentage: 50},
      {name: "cash - false", count: 1, percentage: 25},
    ])
  })

  it("should return object in order of path/count descending", function() {
    expect(groupProcessor("pathdesc", null, false, mockDataForSorting)).to.eql([
      {name: "card - true", count: 2, percentage: 33.33},
      {name: "card - false", count: 1, percentage: 16.67},
      {name: "cash - true", count: 1, percentage: 16.67},
      {name: "cash - false", count: 1, percentage: 16.67},
      {name: "loan - true", count: 1, percentage: 16.67},
    ])
  })

  it("should return object in order of path/count descending limited by number", function() {
    expect(groupProcessor("pathdesc", 3, false, mockDataForSorting)).to.eql([
      {name: "card - true", count: 2, percentage: 50},
      {name: "card - false", count: 1, percentage: 25},
      {name: "cash - true", count: 1, percentage: 25},
    ])
  })

  it("should return object in order of path/count ascending", function() {
    expect(groupProcessor("pathasc", null, false, mockDataForSorting)).to.eql([
      {name: "card - false", count: 1, percentage: 16.67},
      {name: "card - true", count: 2, percentage: 33.33},
      {name: "cash - true", count: 1, percentage: 16.67},
      {name: "cash - false", count: 1, percentage: 16.67},
      {name: "loan - true", count: 1, percentage: 16.67},
    ])
  })

  it("should return object in order of path/count ascending limited by number", function() {
    expect(groupProcessor("pathasc", 3, false, mockDataForSorting)).to.eql([
      {name: "card - false", count: 1, percentage: 25},
      {name: "card - true", count: 2, percentage: 50},
      {name: "cash - true", count: 1, percentage: 25},
    ])
  })

  it("should return object in natural order of full month name", function() {
    const data = {
      November: 4081,
      April: 5777,
      February: 8836,
      March: 8150,
      January: 8595,
      October: 3868,
      August: 3581,
      July: 4880,
      June: 5506,
      December: 5161,
      September: 2418,
      May: 6839,
    }

    expect(groupProcessor("natural", null, false, data)).to.eql([
      {name: "January", count: 8595, percentage: 12.7},
      {name: "February", count: 8836, percentage: 13.05},
      {name: "March", count: 8150, percentage: 12.04},
      {name: "April", count: 5777, percentage: 8.53},
      {name: "May", count: 6839, percentage: 10.1},
      {name: "June", count: 5506, percentage: 8.13},
      {name: "July", count: 4880, percentage: 7.21},
      {name: "August", count: 3581, percentage: 5.29},
      {name: "September", count: 2418, percentage: 3.57},
      {name: "October", count: 3868, percentage: 5.71},
      {name: "November", count: 4081, percentage: 6.03},
      {name: "December", count: 5161, percentage: 7.62},
    ])
  })

  it("should return object in natural order of short month name", function() {
    const data = {
      Nov: 4081,
      Apr: 5777,
      Feb: 8836,
      Mar: 8150,
      Jan: 8595,
      Oct: 3868,
      Aug: 3581,
      Jul: 4880,
      Jun: 5506,
      Dec: 5161,
      Sep: 2418,
      May: 6839,
    }

    expect(groupProcessor("natural", null, false, data)).to.eql([
      {name: "Jan", count: 8595, percentage: 12.7},
      {name: "Feb", count: 8836, percentage: 13.05},
      {name: "Mar", count: 8150, percentage: 12.04},
      {name: "Apr", count: 5777, percentage: 8.53},
      {name: "May", count: 6839, percentage: 10.1},
      {name: "Jun", count: 5506, percentage: 8.13},
      {name: "Jul", count: 4880, percentage: 7.21},
      {name: "Aug", count: 3581, percentage: 5.29},
      {name: "Sep", count: 2418, percentage: 3.57},
      {name: "Oct", count: 3868, percentage: 5.71},
      {name: "Nov", count: 4081, percentage: 6.03},
      {name: "Dec", count: 5161, percentage: 7.62},
    ])
  })

  it("should return object in natural order of full day name", function() {
    const data = {
      Friday: 4081,
      Wednesday: 5777,
      Saturday: 8836,
      Tuesday: 8150,
      Sunday: 8595,
      Monday: 3868,
      Thursday: 3581,
    }

    expect(groupProcessor("natural", null, false, data)).to.eql([
      {name: "Monday", count: 3868, percentage: 9.02},
      {name: "Tuesday", count: 8150, percentage: 19},
      {name: "Wednesday", count: 5777, percentage: 13.47},
      {name: "Thursday", count: 3581, percentage: 8.35},
      {name: "Friday", count: 4081, percentage: 9.52},
      {name: "Saturday", count: 8836, percentage: 20.6},
      {name: "Sunday", count: 8595, percentage: 20.04},
    ])
  })

  it("should return object in natural order of short day name", function() {
    const data = {
      Fri: 4081,
      Wed: 5777,
      Sat: 8836,
      Tue: 8150,
      Sun: 8595,
      Mon: 3868,
      Thu: 3581,
    }

    expect(groupProcessor("natural", null, false, data)).to.eql([
      {name: "Mon", count: 3868, percentage: 9.02},
      {name: "Tue", count: 8150, percentage: 19},
      {name: "Wed", count: 5777, percentage: 13.47},
      {name: "Thu", count: 3581, percentage: 8.35},
      {name: "Fri", count: 4081, percentage: 9.52},
      {name: "Sat", count: 8836, percentage: 20.6},
      {name: "Sun", count: 8595, percentage: 20.04},
    ])
  })

  it("should return object in natural order of short day name limited by number", function() {
    const data = {
      Fri: 4081,
      Wed: 5777,
      Sat: 8836,
      Tue: 8150,
      Sun: 8595,
      Mon: 3868,
      Thu: 3581,
    }

    expect(groupProcessor("natural", 5, false, data)).to.eql([
      {name: "Mon", count: 3868, percentage: 15.19},
      {name: "Tue", count: 8150, percentage: 32.01},
      {name: "Wed", count: 5777, percentage: 22.69},
      {name: "Thu", count: 3581, percentage: 14.07},
      {name: "Fri", count: 4081, percentage: 16.03},
    ])
  })

  it("should sort name descending naturally if all numbers", function() {
    const data = {
      "52": 4081,
      "100": 5777,
      "89": 8836,
      "2": 8150,
      "22.4": 8595,
      "37.89": 3868,
      "10": 3581,
    }

    expect(groupProcessor("namedesc", null, false, data)).to.eql([
      {name: 100, count: 5777, percentage: 13.47},
      {name: 89, count: 8836, percentage: 20.6},
      {name: 52, count: 4081, percentage: 9.52},
      {name: 37.89, count: 3868, percentage: 9.02},
      {name: 22.4, count: 8595, percentage: 20.04},
      {name: 10, count: 3581, percentage: 8.35},
      {name: 2, count: 8150, percentage: 19},
    ])
  })

  it("should return error when no matcher is found for data", function() {
    const data = {
      "52": 4081,
      "100": 5777,
      "89": 8836,
      "2": 8150,
      "22.4": 8595,
      "37.89": 3868,
      "10": 3581,
    }

    expect(groupProcessor("natural", null, false, data)).to.be.a("string")
  })

  it("should return object with combined remainder", function() {
    expect(groupProcessor("desc", 3, true, mockDataForSorting)).to.eql([
      {name: "card - true", count: 2, percentage: 33.33},
      {name: "cash - true", count: 1, percentage: 16.67},
      {name: "loan - true", count: 1, percentage: 16.67},
      {name: "Other", count: 2, percentage: 33.33},
    ])
  })
})
