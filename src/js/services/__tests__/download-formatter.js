const chai = require("chai")
const expect = chai.expect

const downloadFormatter = require("../download-formatter")

describe("downloadFormatter", () => {
  describe("table", () => {
    it("should return empty array if data set is empty", () => {
      expect(downloadFormatter.table([], null, [])).to.eql([])
      expect(downloadFormatter.table([], null, {})).to.eql([])
    })

    describe("when analysed", () => {
      it("should format correctly", () => {
        const mockData = {
          sum: 20,
          average: 4,
        }

        expect(downloadFormatter.table([], null, mockData)).to.eql([
          {type: "data", cols: ["sum", 20]},
          {type: "data", cols: ["average", 4]},
        ])
      })
    })

    describe("when grouped counts", () => {
      it("should format correctly when object", () => {
        const mockData = {
          Coldplay: 2,
          Muse: 1,
        }

        expect(downloadFormatter.table(["artist"], {name: "count"}, mockData)).to.eql([
          {type: "header", cols: ["name", "count"]},
          {type: "data", cols: ["Coldplay", 2]},
          {type: "data", cols: ["Muse", 1]},
        ])
      })

      it("should format correctly when object for mutiple groupings", () => {
        const mockData = {
          Coldplay: {Parachutes: 1, "X&Y": 1},
          Muse: {Showbiz: 1},
        }

        expect(downloadFormatter.table(["artist", "album"], {name: "count"}, mockData)).to.eql([
          {type: "header", cols: ["name", "count"]},
          {type: "data", cols: ["Coldplay - Parachutes", 1]},
          {type: "data", cols: ["Coldplay - X&Y", 1]},
          {type: "data", cols: ["Muse - Showbiz", 1]},
        ])
      })

      it("should format correctly when array", () => {
        const mockData = [
          {name: "Coldplay", count: 2},
          {name: "Muse", count: 1},
        ]

        expect(downloadFormatter.table(["artist"], {name: "count"}, mockData)).to.eql([
          {type: "header", cols: ["name", "count"]},
          {type: "data", cols: ["Coldplay", 2]},
          {type: "data", cols: ["Muse", 1]},
        ])
      })

      it("should format correctly when array for mutiple groupings", () => {
        const mockData = [
          {name: "Coldplay - Parachutes", count: 1},
          {name: "Coldplay - X&Y", count: 1},
          {name: "Muse - Showbiz", count: 1},
        ]

        expect(downloadFormatter.table(["artist", "album"], {name: "count"}, mockData)).to.eql([
          {type: "header", cols: ["name", "count"]},
          {type: "data", cols: ["Coldplay - Parachutes", 1]},
          {type: "data", cols: ["Coldplay - X&Y", 1]},
          {type: "data", cols: ["Muse - Showbiz", 1]},
        ])
      })
    })

    describe("when grouped", () => {
      it("should format correctly", () => {
        const mockData = {
          Coldplay: [
            {artist: "Coldplay", album: "Parachutes", title: "Shiver"},
            {artist: "Coldplay", album: "X&Y", title: "Square One"},
          ],
          Muse: [{artist: "Muse", album: "Showbiz", title: "Sunburn"}],
        }

        expect(downloadFormatter.table(["artist"], null, mockData)).to.eql([
          {type: "header", cols: ["artist", "album", "title"]},
          {type: "title", cols: ["Coldplay"], span: 3},
          {type: "data", cols: ["Coldplay", "Parachutes", "Shiver"]},
          {type: "data", cols: ["Coldplay", "X&Y", "Square One"]},
          {type: "title", cols: ["Muse"], span: 3},
          {type: "data", cols: ["Muse", "Showbiz", "Sunburn"]},
        ])
      })

      it("should format correctly for mutiple", () => {
        const mockData = {
          Coldplay: {
            Parachutes: [{artist: "Coldplay", album: "Parachutes", title: "Shiver"}],
            "X&Y": [{artist: "Coldplay", album: "X&Y", title: "Square One"}],
          },
          Muse: {
            Showbiz: [{artist: "Muse", album: "Showbiz", title: "Sunburn"}],
          },
        }

        expect(downloadFormatter.table(["artist", "album"], null, mockData)).to.eql([
          {type: "header", cols: ["artist", "album", "title"]},
          {type: "title", cols: ["Coldplay - Parachutes"], span: 3},
          {type: "data", cols: ["Coldplay", "Parachutes", "Shiver"]},
          {type: "title", cols: ["Coldplay - X&Y"], span: 3},
          {type: "data", cols: ["Coldplay", "X&Y", "Square One"]},
          {type: "title", cols: ["Muse - Showbiz"], span: 3},
          {type: "data", cols: ["Muse", "Showbiz", "Sunburn"]},
        ])
      })
    })

    describe("when array", () => {
      it("should format correctly", () => {
        const mockData = [
          {artist: "Coldplay", album: "Parachutes", title: "Shiver"},
          {artist: "Coldplay", album: "X&Y", title: "Square One"},
          {artist: "Muse", album: "Showbiz", title: "Sunburn"},
        ]

        expect(downloadFormatter.table([], null, mockData)).to.eql([
          {type: "header", cols: ["artist", "album", "title"]},
          {type: "data", cols: ["Coldplay", "Parachutes", "Shiver"]},
          {type: "data", cols: ["Coldplay", "X&Y", "Square One"]},
          {type: "data", cols: ["Muse", "Showbiz", "Sunburn"]},
        ])
      })
    })
  })

  describe("csv", () => {
    it("should return null if data set is empty", () => {
      expect(downloadFormatter.csv([], null, [])).to.eql(null)
      expect(downloadFormatter.csv([], null, {})).to.eql(null)
    })

    describe("when analysed", () => {
      it("should format correctly", () => {
        const mockData = {
          sum: 20,
          average: 4,
        }

        expect(downloadFormatter.csv([], null, mockData)).to.eql("sum,20\r\naverage,4")
      })
    })

    describe("when grouped counts", () => {
      it("should format correctly when object", () => {
        const mockData = {
          Coldplay: 2,
          Muse: 1,
        }

        expect(downloadFormatter.csv(["artist"], {name: "count"}, mockData)).to.eql(
          "name,count\r\nColdplay,2\r\nMuse,1",
        )
      })

      it("should format correctly when object for mutiple groupings", () => {
        const mockData = {
          Coldplay: {Parachutes: 1, "X&Y": 1},
          Muse: {Showbiz: 1},
        }

        expect(downloadFormatter.csv(["artist", "album"], {name: "count"}, mockData)).to.eql(
          "name,count\r\nColdplay - Parachutes,1\r\nColdplay - X&Y,1\r\nMuse - Showbiz,1",
        )
      })

      it("should cope when the count field has a comma when object", () => {
        const mockData = {
          "10,000 Days": 2,
          Muse: 1,
        }

        expect(downloadFormatter.csv(["artist"], {name: "count"}, mockData)).to.eql(
          'name,count\r\n"10,000 Days",2\r\nMuse,1',
        )
      })

      it("should format correctly when array", () => {
        const mockData = [
          {name: "Coldplay", count: 2},
          {name: "Muse", count: 1},
        ]

        expect(downloadFormatter.csv(["artist"], {name: "count"}, mockData)).to.eql(
          "name,count\r\nColdplay,2\r\nMuse,1",
        )
      })

      it("should format correctly when array for mutiple groupings", () => {
        const mockData = [
          {name: "Coldplay - Parachutes", count: 1},
          {name: "Coldplay - X&Y", count: 1},
          {name: "Muse - Showbiz", count: 1},
        ]

        expect(downloadFormatter.csv(["artist", "album"], {name: "count"}, mockData)).to.eql(
          "name,count\r\nColdplay - Parachutes,1\r\nColdplay - X&Y,1\r\nMuse - Showbiz,1",
        )
      })

      it("should cope when the count field has a comma when array", () => {
        const mockData = [
          {name: "10,000 Days", count: 2},
          {name: "Muse", count: 1},
        ]

        expect(downloadFormatter.csv(["artist"], {name: "count"}, mockData)).to.eql(
          'name,count\r\n"10,000 Days",2\r\nMuse,1',
        )
      })
    })

    describe("when grouped", () => {
      it("should format correctly", () => {
        const mockData = {
          Coldplay: [
            {artist: "Coldplay", album: "Parachutes", title: "Shiver"},
            {artist: "Coldplay", album: "X&Y", title: "Square One"},
          ],
          Muse: [{artist: "Muse", album: "Showbiz", title: "Sunburn"}],
        }

        expect(downloadFormatter.csv(["artist"], null, mockData)).to.eql(
          "artist,album,title\r\nColdplay\r\nColdplay,Parachutes,Shiver\r\nColdplay,X&Y,Square One\r\nMuse\r\nMuse,Showbiz,Sunburn",
        )
      })

      it("should format correctly for mutiple", () => {
        const mockData = {
          Coldplay: {
            Parachutes: [{artist: "Coldplay", album: "Parachutes", title: "Shiver"}],
            "X&Y": [{artist: "Coldplay", album: "X&Y", title: "Square One"}],
          },
          Muse: {
            Showbiz: [{artist: "Muse", album: "Showbiz", title: "Sunburn"}],
          },
        }

        expect(downloadFormatter.csv(["artist", "album"], null, mockData)).to.eql(
          "artist,album,title\r\nColdplay - Parachutes\r\nColdplay,Parachutes,Shiver\r\nColdplay - X&Y\r\nColdplay,X&Y,Square One\r\nMuse - Showbiz\r\nMuse,Showbiz,Sunburn",
        )
      })

      it("should cope when there is a string value with a comma", () => {
        const mockData = {
          Tool: [{artist: "Tool", album: "10,000 Days", title: "Schism"}],
        }

        expect(downloadFormatter.csv(["artist"], null, mockData)).to.eql(
          'artist,album,title\r\nTool\r\nTool,"10,000 Days",Schism',
        )
      })

      it("should cope when there is an array value", () => {
        const mockData = {
          Coldplay: [
            {artist: "Coldplay", album: "Parachutes", title: "Shiver", genres: ["Rock", "Indie"]},
          ],
        }

        expect(downloadFormatter.csv(["artist"], null, mockData)).to.eql(
          'artist,album,title,genres\r\nColdplay\r\nColdplay,Parachutes,Shiver,"Rock,Indie"',
        )
      })

      it("should cope when there is a group heading value with a comma", () => {
        const mockData = {
          "10,000 Days": [{artist: "Tool", album: "10,000 Days", title: "Schism"}],
        }

        expect(downloadFormatter.csv(["artist"], null, mockData)).to.eql(
          'artist,album,title\r\n"10,000 Days"\r\nTool,"10,000 Days",Schism',
        )
      })
    })

    describe("when array", () => {
      it("should format correctly", () => {
        const mockData = [
          {artist: "Coldplay", album: "Parachutes", title: "Shiver"},
          {artist: "Coldplay", album: "X&Y", title: "Square One"},
          {artist: "Muse", album: "Showbiz", title: "Sunburn"},
        ]

        expect(downloadFormatter.csv([], null, mockData)).to.eql(
          "artist,album,title\r\nColdplay,Parachutes,Shiver\r\nColdplay,X&Y,Square One\r\nMuse,Showbiz,Sunburn",
        )
      })

      it("should cope when there is a string value with a comma", () => {
        const mockData = [{artist: "Tool", album: "10,000 Days", title: "Schism"}]

        expect(downloadFormatter.csv([], null, mockData)).to.eql(
          'artist,album,title\r\nTool,"10,000 Days",Schism',
        )
      })

      it("should cope when there is an array value", () => {
        const mockData = [
          {artist: "Coldplay", album: "Parachutes", title: "Shiver", genres: ["Rock", "Indie"]},
        ]

        expect(downloadFormatter.csv([], null, mockData)).to.eql(
          'artist,album,title,genres\r\nColdplay,Parachutes,Shiver,"Rock,Indie"',
        )
      })

      it("should cope when there is an object value", () => {
        const mockData = [
          {
            artist: "Coldplay",
            album: "Parachutes",
            title: "Shiver",
            genres: {Rock: true, Indie: false},
          },
        ]

        expect(downloadFormatter.csv([], null, mockData)).to.eql(
          'artist,album,title,genres\r\nColdplay,Parachutes,Shiver,"{"Rock":true,"Indie":false}"',
        )
      })
    })
  })
})
