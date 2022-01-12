const coreMethods = require("./core.js")
const numbersMethods = require("./numbers.js")
const stringMethods = require("./strings.js")
const arrayMethids = require("./arrays.js")
const objectMethods = require("./objects.js")

module.exports = {
    ...coreMethods,
    ...numbersMethods,
    ...stringMethods,
    ...arrayMethids,
    ...objectMethods
}