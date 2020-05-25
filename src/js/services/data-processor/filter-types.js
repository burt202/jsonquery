const R = require("ramda")

const validator = require("../validator")

const parse = require("date-fns/parse")
const isValid = require("date-fns/is_valid")
const isDateBefore = require("date-fns/is_before")
const isDateAfter = require("date-fns/is_after")
const isWithinRange = require("date-fns/is_within_range")
const isSameDay = require("date-fns/is_same_day")

function isValidDate(date) {
  return isValid(parse(date))
}

const isSameDayAs = R.curry((filterValue, dataValue) => {
  return isSameDay(filterValue, dataValue)
})

const isBefore = R.curry((filterValue, dataValue) => {
  return isDateBefore(dataValue, filterValue)
})

const isAfter = R.curry((filterValue, dataValue) => {
  return isDateAfter(dataValue, filterValue)
})

const isBetweenDates = R.curry((start, end, dataValue) => {
  return isWithinRange(dataValue, start, end)
})

const isOneOf = R.curry((filterValue, dataValue) => {
  dataValue = !R.isNil(dataValue) ? dataValue.toString() : ""
  return R.compose(R.contains(dataValue), R.split(","), R.defaultTo(""))(filterValue)
})

const containsOneOf = R.curry((filterValue, dataValue) => {
  return R.compose(
    R.any(R.equals(true)),
    R.map(R.contains(R.__, dataValue)),
    R.split(","),
  )(filterValue)
})

const isBetween = R.curry((start, end, dataValue) => {
  return R.allPass([R.gt(R.__, start), R.lt(R.__, end)])(dataValue)
})

const matches = R.curry((filterValue, dataValue) => {
  const regParts = filterValue.match(/^\/(.*?)\/([gim]*)$/)
  const regex = regParts ? new RegExp(regParts[1], regParts[2]) : new RegExp(filterValue)
  return R.test(regex, dataValue)
})

function getStringFilter(filter) {
  if (filter.value && filter.value.length) {
    if (filter.operator === "eq") return R.equals(filter.value)
    if (filter.operator === "neq") return R.compose(R.not, R.equals(filter.value))
    if (filter.operator === "iof") return isOneOf(filter.value)
    if (filter.operator === "inof") return R.compose(R.not, isOneOf(filter.value))
    if (filter.operator === "rgm") return matches(filter.value)
    if (filter.operator === "rgnm") return R.compose(R.not, matches(filter.value))
  }

  if (filter.operator === "nl") return R.isNil
  if (filter.operator === "nnl") return R.compose(R.not, R.isNil)

  return null
}

function getNumberFilter(filter) {
  if (filter.value && filter.value.length) {
    if (filter.operator === "eq") return R.equals(parseFloat(filter.value))
    if (filter.operator === "neq") return R.compose(R.not, R.equals(parseFloat(filter.value)))
    if (filter.operator === "gt") return R.gt(R.__, parseFloat(filter.value))
    if (filter.operator === "gte") return R.gte(R.__, parseFloat(filter.value))
    if (filter.operator === "lt") return R.lt(R.__, parseFloat(filter.value))
    if (filter.operator === "lte") return R.lte(R.__, parseFloat(filter.value))
    if (filter.operator === "iof") return isOneOf(filter.value)
    if (filter.operator === "inof") return R.compose(R.not, isOneOf(filter.value))

    if (filter.value1 && filter.value1.length) {
      if (filter.operator === "btw")
        return isBetween(parseFloat(filter.value), parseFloat(filter.value1))
      if (filter.operator === "nbtw")
        return R.compose(R.not, isBetween(parseFloat(filter.value), parseFloat(filter.value1)))
    }
  }

  if (filter.operator === "nl") return R.isNil
  if (filter.operator === "nnl") return R.compose(R.not, R.isNil)

  return null
}

function getBoolFilter(filter) {
  if (filter.operator === "nl") return R.isNil
  if (filter.operator === "nnl") return R.compose(R.not, R.isNil)
  if (filter.operator === "true") return R.equals(true)
  if (filter.operator === "false") return R.equals(false)

  return null
}

function getDateFilter(filter) {
  if (filter.value && filter.value.length) {
    if (filter.operator === "eq") return R.equals(filter.value)
    if (filter.operator === "neq") return R.compose(R.not, R.equals(filter.value))

    if (filter.value.length >= 8 && isValidDate(filter.value)) {
      if (filter.operator === "sd") return isSameDayAs(filter.value)
      if (filter.operator === "be") return isBefore(filter.value)
      if (filter.operator === "af") return isAfter(filter.value)
    }

    if (filter.value1 && filter.value1.length >= 8 && isValidDate(filter.value1)) {
      if (filter.operator === "btw") return isBetweenDates(filter.value, filter.value1)
      if (filter.operator === "nbtw")
        return R.compose(R.not, isBetweenDates(filter.value, filter.value1))
    }
  }

  if (filter.operator === "nl") return R.isNil
  if (filter.operator === "nnl") return R.compose(R.not, R.isNil)

  return null
}

function getTimeFilter(filter) {
  if (filter.value && filter.value.length) {
    if (filter.operator === "eq") return R.equals(filter.value)
    if (filter.operator === "neq") return R.compose(R.not, R.equals(filter.value))

    if (filter.value.length >= 5 && validator.isValidTime(filter.value)) {
      if (filter.operator === "be") return R.gt(filter.value)
      if (filter.operator === "af") return R.lt(filter.value)
    }

    if (filter.value1 && filter.value1.length >= 5 && validator.isValidTime(filter.value1)) {
      if (filter.operator === "btw") return isBetween(filter.value, filter.value1)
      if (filter.operator === "nbtw")
        return R.compose(R.not, isBetween(filter.value, filter.value1))
    }
  }

  if (filter.operator === "nl") return R.isNil
  if (filter.operator === "nnl") return R.compose(R.not, R.isNil)

  return null
}

function getArrayFilter(filter) {
  if (filter.value && filter.value.length) {
    if (filter.operator === "cos") return R.contains(filter.value)
    if (filter.operator === "con") return R.contains(parseFloat(filter.value))
    if (filter.operator === "cof") return containsOneOf(filter.value)
    if (filter.operator === "hl") return R.compose(R.equals(parseInt(filter.value, 10)), R.length)
    if (filter.operator === "dhl")
      return R.compose(R.not, R.equals(parseInt(filter.value, 10)), R.length)
    if (filter.operator === "hlgt")
      return R.compose(R.gt(R.__, parseInt(filter.value, 10)), R.length)
    if (filter.operator === "hlgte")
      return R.compose(R.gte(R.__, parseInt(filter.value, 10)), R.length)
    if (filter.operator === "hllt")
      return R.compose(R.lt(R.__, parseInt(filter.value, 10)), R.length)
    if (filter.operator === "hllte")
      return R.compose(R.lte(R.__, parseInt(filter.value, 10)), R.length)
  }

  return null
}

module.exports = {
  string: getStringFilter,
  number: getNumberFilter,
  bool: getBoolFilter,
  date: getDateFilter,
  time: getTimeFilter,
  array: getArrayFilter,
}
