const chai = require("chai")
const expect = chai.expect

const downloadFormatter = require("../../../src/js/services/download-formatter")

describe("downloadFormatter", function() {

  describe("csv", function() {
    it("should return null if data set is empty", function() {
      expect(downloadFormatter.csv([], false, [])).to.eql(null)
      expect(downloadFormatter.csv([], false, {})).to.eql(null)
    })

    describe("when sumed or averaged", function() {
      it("should format correctly", function() {
        const mockData = {
          total: 20,
        }

        expect(downloadFormatter.csv([], false, mockData)).to.eql(
          "total,20"
        )
      })
    })

    describe("when grouped counts", function() {
      it("should format correctly", function() {
        const mockData = [
          "Coldplay: 2",
          "Muse: 1",
        ]

        expect(downloadFormatter.csv(["artist"], true, mockData)).to.eql(
          "Coldplay,2\r\nMuse,1"
        )
      })

      it("should format correctly for mutiple", function() {
        const mockData = {
          Coldplay: ["Parachutes: 1", "X&Y: 1"],
          Muse: ["Showbiz: 1"],
        }

        expect(downloadFormatter.csv(["artist", "album"], true, mockData)).to.eql(
          "Coldplay - Parachutes,1\r\nColdplay - X&Y,1\r\nMuse - Showbiz,1"
        )
      })

      it("should cope when the count field has a comma", function() {
        const mockData = [
          "10,000 Days: 2",
          "Muse: 1",
        ]

        expect(downloadFormatter.csv(["artist"], true, mockData)).to.eql(
          "\"10,000 Days\",2\r\nMuse,1"
        )
      })
    })

    describe("when grouped", function() {

      it("should format correctly", function() {
        const mockData = {
          Coldplay: [{artist: "Coldplay", album: "Parachutes", title: "Shiver"}, {artist: "Coldplay", album: "X&Y", title: "Square One"}],
          Muse: [{artist: "Muse", album: "Showbiz", title: "Sunburn"}],
        }

        expect(downloadFormatter.csv(["artist"], false, mockData)).to.eql(
          "artist,album,title\r\nColdplay\r\nColdplay,Parachutes,Shiver\r\nColdplay,X&Y,Square One\r\nMuse\r\nMuse,Showbiz,Sunburn"
        )
      })

      it("should format correctly for mutiple", function() {
        const mockData = {
          Coldplay: {
            Parachutes: [{artist: "Coldplay", album: "Parachutes", title: "Shiver"}],
            "X&Y": [{artist: "Coldplay", album: "X&Y", title: "Square One"}],
          },
          Muse: {
            Showbiz: [{artist: "Muse", album: "Showbiz", title: "Sunburn"}],
          },
        }

        expect(downloadFormatter.csv(["artist", "album"], false, mockData)).to.eql(
          "artist,album,title\r\nColdplay - Parachutes\r\nColdplay,Parachutes,Shiver\r\nColdplay - X&Y\r\nColdplay,X&Y,Square One\r\nMuse - Showbiz\r\nMuse,Showbiz,Sunburn"
        )
      })

      it("should cope when there is a string value with a comma", function() {
        const mockData = {
          Tool: [{artist: "Tool", album: "10,000 Days", title: "Schism"}],
        }

        expect(downloadFormatter.csv(["artist"], false, mockData)).to.eql(
          "artist,album,title\r\nTool\r\nTool,\"10,000 Days\",Schism"
        )
      })

      it("should cope when there is an array value", function() {
        const mockData = {
          Coldplay: [{artist: "Coldplay", album: "Parachutes", title: "Shiver", genres: ["Rock", "Indie"]}],
        }

        expect(downloadFormatter.csv(["artist"], false, mockData)).to.eql(
          "artist,album,title,genres\r\nColdplay\r\nColdplay,Parachutes,Shiver,\"Rock,Indie\""
        )
      })

      it("should cope when there is a group heading value with a comma", function() {
        const mockData = {
          "10,000 Days": [{artist: "Tool", album: "10,000 Days", title: "Schism"}],
        }

        expect(downloadFormatter.csv(["artist"], false, mockData)).to.eql(
          "artist,album,title\r\n\"10,000 Days\"\r\nTool,\"10,000 Days\",Schism"
        )
      })
    })

    describe("when array", function() {
      it("should format correctly", function() {
        const mockData = [
          {artist: "Coldplay", album: "Parachutes", title: "Shiver"},
          {artist: "Coldplay", album: "X&Y", title: "Square One"},
          {artist: "Muse", album: "Showbiz", title: "Sunburn"},
        ]

        expect(downloadFormatter.csv([], false, mockData)).to.eql(
          "artist,album,title\r\nColdplay,Parachutes,Shiver\r\nColdplay,X&Y,Square One\r\nMuse,Showbiz,Sunburn"
        )
      })

      it("should cope when there is a string value with a comma", function() {
        const mockData = [
          {artist: "Tool", album: "10,000 Days", title: "Schism"},
        ]

        expect(downloadFormatter.csv([], false, mockData)).to.eql(
          "artist,album,title\r\nTool,\"10,000 Days\",Schism"
        )
      })

      it("should cope when there is an array value", function() {
        const mockData = [
          {artist: "Coldplay", album: "Parachutes", title: "Shiver", genres: ["Rock", "Indie"]},
        ]

        expect(downloadFormatter.csv([], false, mockData)).to.eql(
          "artist,album,title,genres\r\nColdplay,Parachutes,Shiver,\"Rock,Indie\""
        )
      })
    })
  })
})
