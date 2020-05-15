const chai = require("chai")
const expect = chai.expect

const schemaGenerator = require("../schema-generator")

const tests = [
  {
    name: "tracks",
    data: {
      Album: "Favourite Worst Nightmare",
      Artist: "Arctic Monkeys",
      Genre: "Alternative Rock",
      Length: 172,
      Size: "22.05 MB",
      Title: "Brianstorm",
      Track: 1,
      Year: 2007,
    },
    expected: {
      Title: "string",
      Artist: "string",
      Album: "string",
      Track: "number",
      Year: "number",
      Length: "number",
      Size: "string",
      Genre: "string",
    },
  },
  {
    name: "accounts",
    data: {
      balancesTotal: 159,
      dateCreated: "2016-05-23T22:00:33+00:00",
      deleted: false,
      lastUpdateCode: 0,
      lastUpdated: "2017-01-15T03:30:38+00:00",
      name: "Foo Bar",
      uid: "999",
      type: "credit",
      updatesTotal: 565,
    },
    expected: {
      type: "string",
      deleted: "bool",
      uid: "string",
      name: "string",
      lastUpdateCode: "number",
      dateCreated: "date",
      lastUpdated: "date",
      balancesTotal: "number",
      updatesTotal: "number",
    },
  },
  {
    name: "users",
    data: {
      accountsTotal: 5,
      allTransactionsConfirmedTotal: 901,
      allTransactionsTotal: 1062,
      autoAccountsTotal: 5,
      autoAccountsTypes: ["credit", "current"],
      beforeRegistrationTransactionsConfirmedTotal: 492,
      beforeRegistrationTransactionsTotal: 509,
      dateRegistered: "2017-02-01T11:28:26",
      documentSize: 39352,
      isDemoUser: false,
      isLabUser: false,
      lastModified: "2017-05-11T05:25:29",
      lastMonthsTransactionsConfirmedTotal: 73,
      lastMonthsTransactionsTotal: 164,
      lastThreeMonthsTransactionsConfirmedTotal: 378,
      lastThreeMonthsTransactionsTotal: 522,
      monthFirstAccountWasAdded: "2017-02",
      recentTransactionsConfirmedTotal: 67,
      recentTransactionsTotal: 135,
      spendingGoalsTotal: 0,
      registeredWithProvider: true,
      subscriptionStatus: "active",
    },
    expected: {
      dateRegistered: "date",
      registeredWithProvider: "bool",
      subscriptionStatus: "string",
      isLabUser: "bool",
      isDemoUser: "bool",
      lastModified: "date",
      spendingGoalsTotal: "number",
      accountsTotal: "number",
      autoAccountsTotal: "number",
      allTransactionsTotal: "number",
      allTransactionsConfirmedTotal: "number",
      lastThreeMonthsTransactionsTotal: "number",
      lastThreeMonthsTransactionsConfirmedTotal: "number",
      lastMonthsTransactionsTotal: "number",
      lastMonthsTransactionsConfirmedTotal: "number",
      beforeRegistrationTransactionsTotal: "number",
      beforeRegistrationTransactionsConfirmedTotal: "number",
      recentTransactionsTotal: "number",
      recentTransactionsConfirmedTotal: "number",
      autoAccountsTypes: "array",
      documentSize: "number",
      monthFirstAccountWasAdded: "date",
    },
  },
]

describe("schemaGenerator", function() {
  describe("generate", function() {
    tests.forEach(function(test) {
      it(`should translate ${test.name} data into a schema correctly`, function() {
        expect(schemaGenerator.generate(test.data)).to.eql(test.expected)
      })
    })

    it("should default to 'string' if value is null", function() {
      expect(schemaGenerator.generate({foo: null})).to.eql({foo: "string"})
    })
  })
})
