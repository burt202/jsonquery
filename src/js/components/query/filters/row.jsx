const React = require("react")
const PropTypes = require("prop-types")
const classNames = require("classnames")

const R = require("ramda")

const defaultInput = {}
const dateInput = {placeholder: "YYYYMMDD", maxLength: 8}
const dateTimeInput = {placeholder: "YYYYMMDD (hhmm)", maxLength: 13}
const timeInput = {placeholder: "hh:mm:ss", maxLength: 8}
const separateWithCommaInput = {placeholder: "separate with comma"}
const regexInput = {placeholder: "enter regex here"}

const filterConfig = {
  string: [
    {text: "Equal to", value: "eq", inputs: [defaultInput]},
    {text: "Not equal to", value: "neq", inputs: [defaultInput]},
    {text: "Is null", value: "nl"},
    {text: "Is not null", value: "nnl"},
    {text: "Is one of", value: "iof", inputs: [separateWithCommaInput]},
    {text: "Is not one of", value: "inof", inputs: [separateWithCommaInput]},
    {text: "Matches", value: "rgm", inputs: [regexInput]},
    {text: "Does not match", value: "rgnm", inputs: [regexInput]},
  ],
  number: [
    {text: "Equal to", value: "eq", inputs: [defaultInput]},
    {text: "Not equal to", value: "neq", inputs: [defaultInput]},
    {text: "Is null", value: "nl"},
    {text: "Is not null", value: "nnl"},
    {text: "Greater than", value: "gt", inputs: [defaultInput]},
    {text: "Greater than or equal to", value: "gte", inputs: [defaultInput]},
    {text: "Less than", value: "lt", inputs: [defaultInput]},
    {text: "Less than or equal to", value: "lte", inputs: [defaultInput]},
    {text: "Is one of", value: "iof", inputs: [separateWithCommaInput]},
    {text: "Is not one of", value: "inof", inputs: [separateWithCommaInput]},
    {text: "Is between", value: "btw", inputs: [defaultInput, defaultInput]},
    {text: "Is not between", value: "nbtw", inputs: [defaultInput, defaultInput]},
  ],
  bool: [
    {text: "Is null", value: "nl"},
    {text: "Is not null", value: "nnl"},
    {text: "Is true", value: "true"},
    {text: "Is false", value: "false"},
  ],
  date: [
    {text: "Equal to", value: "eq", inputs: [defaultInput]},
    {text: "Not equal to", value: "neq", inputs: [defaultInput]},
    {text: "Is same day as", value: "sd", inputs: [dateInput]},
    {text: "Is before", value: "be", inputs: [dateTimeInput]},
    {text: "Is after", value: "af", inputs: [dateTimeInput]},
    {text: "Is between", value: "btw", inputs: [dateTimeInput, dateTimeInput]},
    {text: "Is not between", value: "nbtw", inputs: [dateTimeInput, dateTimeInput]},
    {text: "Is null", value: "nl"},
    {text: "Is not null", value: "nnl"},
  ],
  time: [
    {text: "Equal to", value: "eq", inputs: [defaultInput]},
    {text: "Not equal to", value: "neq", inputs: [defaultInput]},
    {text: "Is before", value: "be", inputs: [timeInput]},
    {text: "Is after", value: "af", inputs: [timeInput]},
    {text: "Is between", value: "btw", inputs: [timeInput, timeInput]},
    {text: "Is not between", value: "nbtw", inputs: [timeInput, timeInput]},
    {text: "Is null", value: "nl"},
    {text: "Is not null", value: "nnl"},
  ],
  array: [
    {text: "Contains String", value: "cos", inputs: [defaultInput]},
    {text: "Contains Number", value: "con", inputs: [defaultInput]},
    {text: "Contains one of", value: "cof", inputs: [separateWithCommaInput]},
    {text: "Has length of", value: "hl", inputs: [defaultInput]},
    {text: "Doesnt Have length of", value: "dhl", inputs: [defaultInput]},
    {text: "Has length greater than", value: "hlgt", inputs: [defaultInput]},
    {text: "Has length greater than or equal to", value: "hlgte", inputs: [defaultInput]},
    {text: "Has length less than", value: "hllt", inputs: [defaultInput]},
    {text: "Has length less than or equal to", value: "hllte", inputs: [defaultInput]},
  ],
}

function FilterRow(props) {
  const getInputControlByType = () => {
    if (!filterConfig[props.type]) return "Invalid Type"

    const options = filterConfig[props.type].map(option => {
      return (
        <option key={option.value} value={option.value}>
          {option.text}
        </option>
      )
    })

    let inputs = []
    const selectedOperator = R.find(
      R.propEq("value", props.filter.operator),
      filterConfig[props.type],
    )

    if (selectedOperator && selectedOperator.inputs) {
      inputs = selectedOperator.inputs.map((inputConfig, index) => {
        const inc = index ? index : ""

        return React.createElement(
          "input",
          R.merge(
            {
              key: props.filter.id + inc,
              type: "text",
              name: props.filter.id + inc,
              value: props.filter[`value${inc}`] || "",
              onChange: e => updateFilter(e, `value${inc}`),
            },
            inputConfig,
          ),
        )
      })
    }

    const classnames = classNames("filter-controls", props.type)

    return (
      <div className={classnames}>
        <select
          name={props.filter.id}
          value={props.filter.operator}
          onChange={e => updateFilter(e, "operator")}
        >
          {options}
        </select>
        <div className="inputs">{inputs}</div>
      </div>
    )
  }

  const toggleFilter = () => {
    props.onToggle(props.filter.id, !props.filter.active)
  }

  const deleteFilter = () => {
    props.onDelete(props.filter.id)
  }

  const updateFilter = (e, prop) => {
    const toUpdate = {}
    toUpdate[prop] = e.target.value
    props.onUpdate(props.filter.id, toUpdate)
  }

  const toggleClass = props.filter.active ? "active" : "inactive"

  return (
    <tr key={props.filter.id} className={toggleClass}>
      <td>{props.filter.name}</td>
      <td>{getInputControlByType()}</td>
      <td>
        <a className="site-link" onClick={toggleFilter}>
          Toggle
        </a>
      </td>
      <td>
        <a className="site-link" onClick={deleteFilter}>
          Remove
        </a>
      </td>
    </tr>
  )
}

FilterRow.propTypes = {
  type: PropTypes.string.isRequired,
  filter: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
}

module.exports = FilterRow
