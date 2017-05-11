const chai = require("chai")
const expect = chai.expect

const groupingAnalyser = require("../../../src/js/services/grouping-analyser")

describe("groupingAnalyser", function() {

  describe("getAnalysis", function() {
    describe("when there are no groups", function() {
      it("should return empty array", function() {
        const res = groupingAnalyser.getAnalysis({})

        expect(res).to.eql([])
      })
    })

    describe("for 1 level of grouping", function() {
      var res

      beforeEach(function() {
        res = groupingAnalyser.getAnalysis({foo: [1, 2, 3], bar: [1]})
      })

      it("should return the total number of groups", function() {
        expect(res[0]).to.eql({name: "No. of Groups", value: 2})
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

    describe("for 2 levels of grouping", function() {
      var res

      beforeEach(function() {
        res = groupingAnalyser.getAnalysis({foo: {a: [1]}, bar: {b: [1, 2], c: [1]}})
      })

      it("should return the total number of groups", function() {
        expect(res[0]).to.eql({name: "No. of Groups", value: 3})
      })

      it("should return the size of the biggest group", function() {
        expect(res[1]).to.eql({name: "Max Group Size", value: 2})
      })

      it("should return the size of the smallest group", function() {
        expect(res[2]).to.eql({name: "Min Group Size", value: 1})
      })

      it("should return the mean average group size", function() {
        expect(res[3]).to.eql({name: "Average Group Size", value: 1.33})
      })
    })
  })
})
