const chai = require("chai")
const expect = chai.expect

const downloadFormatter = require("../../../src/js/services/download-formatter")

describe("downloadFormatter", function() {

  describe("table", function() {
    it("should return null if data set is empty", function() {
      expect(downloadFormatter.table([], [])).to.eql(null)
      expect(downloadFormatter.table([], {})).to.eql(null)
    })

    describe("when analysed", function() {
      it("should format correctly", function() {
        const mockData = {
          sum: 20,
          average: 4,
        }

        expect(downloadFormatter.table([], mockData)).to.eql(
          "sum,20\r\naverage,4"
        )
      })
    })

    describe("when grouped counts", function() {
      it("should format correctly", function() {
        const mockData = [
          {name: "Coldplay", count: 2},
          {name: "Muse", count: 1},
        ]

        expect(downloadFormatter.table(["artist"], mockData)).to.eql(
          "name,count\r\nColdplay,2\r\nMuse,1"
        )
      })

      it("should format correctly for mutiple groupings", function() {
        const mockData = [
          {name: "Coldplay - Parachutes", count: 1},
          {name: "Coldplay - X&Y", count: 1},
          {name: "Muse - Showbiz", count: 1},
        ]

        expect(downloadFormatter.table(["artist", "album"], mockData)).to.eql(
          "name,count\r\nColdplay - Parachutes,1\r\nColdplay - X&Y,1\r\nMuse - Showbiz,1"
        )
      })

      it("should cope when the count field has a comma", function() {
        const mockData = [
          {name: "10,000 Days", count: 2},
          {name: "Muse", count: 1},
        ]

        expect(downloadFormatter.table(["artist"], mockData)).to.eql(
          "name,count\r\n\"10,000 Days\",2\r\nMuse,1"
        )
      })
    })

    describe("when grouped", function() {

      it("should format correctly", function() {
        const mockData = {
          Coldplay: [{artist: "Coldplay", album: "Parachutes", title: "Shiver"}, {artist: "Coldplay", album: "X&Y", title: "Square One"}],
          Muse: [{artist: "Muse", album: "Showbiz", title: "Sunburn"}],
        }

        expect(downloadFormatter.table(["artist"], mockData)).to.eql(
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

        expect(downloadFormatter.table(["artist", "album"], mockData)).to.eql(
          "artist,album,title\r\nColdplay - Parachutes\r\nColdplay,Parachutes,Shiver\r\nColdplay - X&Y\r\nColdplay,X&Y,Square One\r\nMuse - Showbiz\r\nMuse,Showbiz,Sunburn"
        )
      })

      it("should cope when there is a string value with a comma", function() {
        const mockData = {
          Tool: [{artist: "Tool", album: "10,000 Days", title: "Schism"}],
        }

        expect(downloadFormatter.table(["artist"], mockData)).to.eql(
          "artist,album,title\r\nTool\r\nTool,\"10,000 Days\",Schism"
        )
      })

      it("should cope when there is an array value", function() {
        const mockData = {
          Coldplay: [{artist: "Coldplay", album: "Parachutes", title: "Shiver", genres: ["Rock", "Indie"]}],
        }

        expect(downloadFormatter.table(["artist"], mockData)).to.eql(
          "artist,album,title,genres\r\nColdplay\r\nColdplay,Parachutes,Shiver,\"Rock,Indie\""
        )
      })

      it("should cope when there is a group heading value with a comma", function() {
        const mockData = {
          "10,000 Days": [{artist: "Tool", album: "10,000 Days", title: "Schism"}],
        }

        expect(downloadFormatter.table(["artist"], mockData)).to.eql(
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

        expect(downloadFormatter.table([], mockData)).to.eql(
          "artist,album,title\r\nColdplay,Parachutes,Shiver\r\nColdplay,X&Y,Square One\r\nMuse,Showbiz,Sunburn"
        )
      })

      it("should cope when there is a string value with a comma", function() {
        const mockData = [
          {artist: "Tool", album: "10,000 Days", title: "Schism"},
        ]

        expect(downloadFormatter.table([], mockData)).to.eql(
          "artist,album,title\r\nTool,\"10,000 Days\",Schism"
        )
      })

      it("should cope when there is an array value", function() {
        const mockData = [
          {artist: "Coldplay", album: "Parachutes", title: "Shiver", genres: ["Rock", "Indie"]},
        ]

        expect(downloadFormatter.table([], mockData)).to.eql(
          "artist,album,title,genres\r\nColdplay,Parachutes,Shiver,\"Rock,Indie\""
        )
      })

      it("should cope when there is an object value", function() {
        const mockData = [
          {artist: "Coldplay", album: "Parachutes", title: "Shiver", genres: {Rock: true, Indie: false}},
        ]

        expect(downloadFormatter.table([], mockData)).to.eql(
          "artist,album,title,genres\r\nColdplay,Parachutes,Shiver,{\"Rock\":true,\"Indie\":false}"
        )
      })
    })
  })
})
