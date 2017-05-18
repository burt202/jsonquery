const config = require("../webpack.config")
const productionise = require("./productionise")

module.exports = productionise(config)
