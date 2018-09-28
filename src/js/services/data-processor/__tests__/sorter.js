const chai = require("chai")
const expect = chai.expect

const sorter = require("../sorter")

describe("sorter", function() {
  const mockDataForSorting = [
    {artist: "Coldplay", album: "Parachutes", trackNo: 2},
    {artist: "Coldplay", album: "A Rush Of Blood", trackNo: 3},
    {artist: "Coldplay", album: "A Rush Of Blood", trackNo: 1},
    {artist: "Coldplay", album: "Parachutes", trackNo: 5},
    {artist: "Coldplay", album: "Parachutes", trackNo: 1},
  ]

  it("should sort the data in ascending order", function() {
    const sorters = [{field: "trackNo", direction: "asc"}]

    expect(sorter(sorters, mockDataForSorting)).to.eql([
      {artist: "Coldplay", album: "A Rush Of Blood", trackNo: 1},
      {artist: "Coldplay", album: "Parachutes", trackNo: 1},
      {artist: "Coldplay", album: "Parachutes", trackNo: 2},
      {artist: "Coldplay", album: "A Rush Of Blood", trackNo: 3},
      {artist: "Coldplay", album: "Parachutes", trackNo: 5},
    ])
  })

  it("should sort the data in descending order", function() {
    const sorters = [{field: "trackNo", direction: "desc"}]

    expect(sorter(sorters, mockDataForSorting)).to.eql([
      {artist: "Coldplay", album: "Parachutes", trackNo: 5},
      {artist: "Coldplay", album: "A Rush Of Blood", trackNo: 3},
      {artist: "Coldplay", album: "Parachutes", trackNo: 2},
      {artist: "Coldplay", album: "A Rush Of Blood", trackNo: 1},
      {artist: "Coldplay", album: "Parachutes", trackNo: 1},
    ])
  })

  it("should sort the data using multiple sorts", function() {
    const sorters = [
      {field: "album", direction: "asc"},
      {field: "trackNo", direction: "asc"},
    ]

    expect(sorter(sorters, mockDataForSorting)).to.eql([
      {artist: "Coldplay", album: "A Rush Of Blood", trackNo: 1},
      {artist: "Coldplay", album: "A Rush Of Blood", trackNo: 3},
      {artist: "Coldplay", album: "Parachutes", trackNo: 1},
      {artist: "Coldplay", album: "Parachutes", trackNo: 2},
      {artist: "Coldplay", album: "Parachutes", trackNo: 5},
    ])
  })
})
