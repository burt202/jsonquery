const chai = require("chai")
const expect = chai.expect

const transformer = require("../../../src/js/helpers/transformer")

describe("transformer", function() {

  describe("convertToCsv", function() {
    it("should return null if data set is empty", function() {
      expect(transformer.convertToCsv([], false, false, [])).to.eql(null)
      expect(transformer.convertToCsv([], false, false, {})).to.eql(null)
    })

    it("should format correctly when array is passed in", function() {
      const mockData = [
        {artist: "Coldplay", album: "Parachutes", title: "Shiver"},
        {artist: "Coldplay", album: "X&Y", title: "Square One"},
        {artist: "Muse", album: "Showbiz", title: "Sunburn"},
      ]

      expect(transformer.convertToCsv([], false, false, mockData)).to.eql(
        "artist,album,title\r\nColdplay,Parachutes,Shiver\r\nColdplay,X&Y,Square One\r\nMuse,Showbiz,Sunburn"
      )
    })

    it("should format correctly when sumed or averaged", function() {
      const mockData = {
        total: 20,
      }

      expect(transformer.convertToCsv([], false, true, mockData)).to.eql(
        "total,20"
      )
    })

    it("should format correctly when grouped data counts is passed in", function() {
      const mockData = [
        "Coldplay: 2",
        "Muse: 1",
      ]

      expect(transformer.convertToCsv(["artist"], true, false, mockData)).to.eql(
        "Coldplay,2\r\nMuse,1"
      )
    })

    it("should format correctly when mutiple grouped data counts is passed in", function() {
      const mockData = {
        Coldplay: ["Parachutes: 1", "X&Y: 1"],
        Muse: ["Showbiz: 1"],
      }

      expect(transformer.convertToCsv(["artist", "album"], true, false, mockData)).to.eql(
        "Coldplay - Parachutes,1\r\nColdplay - X&Y,1\r\nMuse - Showbiz,1"
      )
    })

    it("should format correctly when grouped data object is passed in", function() {
      const mockData = {
        Coldplay: [{artist: "Coldplay", album: "Parachutes", title: "Shiver"}, {artist: "Coldplay", album: "X&Y", title: "Square One"}],
        Muse: [{artist: "Muse", album: "Showbiz", title: "Sunburn"}],
      }

      expect(transformer.convertToCsv(["artist"], false, false, mockData)).to.eql(
        "artist,album,title\r\nColdplay\r\nColdplay,Parachutes,Shiver\r\nColdplay,X&Y,Square One\r\nMuse\r\nMuse,Showbiz,Sunburn"
      )
    })

    xit("should format correctly when mutiple grouped data object is passed in", function() {
      const mockData = {
        Coldplay: {
          Parachutes: [{artist: "Coldplay", album: "Parachutes", title: "Shiver"}],
          "X&Y": [{artist: "Coldplay", album: "X&Y", title: "Square One"}],
        },
        Muse: {
          Showbiz: [{artist: "Muse", album: "Showbiz", title: "Sunburn"}],
        },
      }

      expect(transformer.convertToCsv(["artist", "album"], false, false, mockData)).to.eql(
        "artist,album,year\r\nColdplay - Parachutes\r\nColdplay,Parachutes,Shiver\r\nColdplay - X&Y\r\nColdplay,X&Y,Square One\r\nMuse - Showbiz\r\nMuse,Showbiz,Sunburn"
      )
    })
  })
})
