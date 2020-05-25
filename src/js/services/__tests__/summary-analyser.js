const chai = require("chai")
const expect = chai.expect

const summaryAnalyser = require("../summary-analyser")

const mockFiltered = [{}, {}, {}, {}, {}, {}]

describe("summaryAnalyser", () => {
  describe("getFilteredTotal", () => {
    it("should return total and percentage", () => {
      const res = summaryAnalyser.getFilteredTotal(mockFiltered, 8)

      expect(res).to.eql({name: "Filtered", value: "6 (75%)"})
    })
  })

  describe("getGroupLimitedTotal", () => {
    it("should return total and percentage", () => {
      const mockLimitedGroups = [{reducer: 2}, {reducer: 3}]
      const res = summaryAnalyser.getGroupLimitedTotal(mockFiltered, 8, mockLimitedGroups)

      expect(res).to.eql({
        name: "Group Limited",
        title: "Relative to filtered data: 83.33%",
        value: "5 (62.5%)",
      })
    })
  })

  describe("getGroupingAnalysis", () => {
    describe("when there are no groups", () => {
      it("should return empty array", () => {
        const res = summaryAnalyser.getGroupingAnalysis({})

        expect(res).to.eql([])
      })
    })

    describe("when there are groups", () => {
      let res

      beforeEach(() => {
        res = summaryAnalyser.getGroupingAnalysis({
          foo: [{}],
          bar: [{}, {}, {}],
          baz: [{}, {}],
          aaa: [{}],
          bbb: [{}, {}, {}],
        })
      })

      it("should return the total number of groups", () => {
        expect(res[0]).to.eql({name: "No. of Groups", value: 5})
      })

      it("should return the size of the biggest group", () => {
        expect(res[1]).to.eql({name: "Max Group Size", value: 3})
      })

      it("should return the size of the smallest group", () => {
        expect(res[2]).to.eql({name: "Min Group Size", value: 1})
      })

      it("should return the mean average group size", () => {
        expect(res[3]).to.eql({name: "Average Group Size", value: 2})
      })
    })
  })
})
