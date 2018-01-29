const chai = require("chai")
const expect = chai.expect

const summaryAnalyser = require("../summary-analyser")

const mockFiltered = [{}, {}, {}, {}, {}, {}]

describe("summaryAnalyser", function() {

  describe("getFilteredTotal", function() {
    it("should return total and percentage", function() {
      const res = summaryAnalyser.getFilteredTotal(mockFiltered, 8)

      expect(res).to.eql({name: "Filtered", value: "6 (75%)"})
    })
  })

  describe("getGroupLimitedTotal", function() {
    it("should return total and percentage", function() {
      const mockLimitedGroups = [{count: 2}, {count: 3}]
      const res = summaryAnalyser.getGroupLimitedTotal(mockFiltered, 8, mockLimitedGroups)

      expect(res).to.eql({
        name: "Group Limited",
        title: "Relative to filtered data: 83.33%",
        value: "5 (62.5%)",
      })
    })
  })

  describe("getGroupingAnalysis", function() {
    describe("when there are no groups", function() {
      it("should return empty array", function() {
        const res = summaryAnalyser.getGroupingAnalysis({})

        expect(res).to.eql([])
      })
    })

    describe("when there are groups", function() {
      let res

      beforeEach(function() {
        res = summaryAnalyser.getGroupingAnalysis({
          foo: 1,
          bar: 3,
          baz: 2,
          aaa: 1,
          bbb: 3,
        })
      })

      it("should return the total number of groups", function() {
        expect(res[0]).to.eql({name: "No. of Groups", value: 5})
      })

      it("should return the size of the biggest group", function() {
        expect(res[1]).to.eql({name: "Max Group Size", value: 3})
      })

      it("should return the size of the smallest group", function() {
        expect(res[2]).to.eql({name: "Min Group Size", value: 1})
      })

      it("should return the mean average group size", function() {
        expect(res[3]).to.eql({name: "Average Group Size", value: 2})
      })
    })
  })
})
