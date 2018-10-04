const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")

const GroupingModal = createReactClass({
  displayName: "GroupingModal",

  propTypes: {
    onDismiss: PropTypes.func.isRequired,
  },

  render() {
    return (
      <div>
        <div className="overlay" />
        <div className="modal">
          <a className="site-link" onClick={this.props.onDismiss}>Close</a>
        </div>
      </div>
    )
  },
})

module.exports = GroupingModal


//  onGroupReducerChange(e) {
//   const groupReducer = (e.target.value && e.target.value.length) ? {name: e.target.value} : null
//   this.props.onGroupReducerChange(groupReducer)
// },

// onSortChange(e) {
//   this.props.onGroupSortChange(e.target.value)
// },

// onLimitChange(e) {
//   const groupLimit = (e.target.value && e.target.value.length) ? parseInt(e.target.value, 10) : null
//   this.props.onGroupLimitChange(groupLimit)
// },

// onCombineRemainderChange() {
//   this.props.onCombineRemainderChange(!this.props.combineRemainder)
// },


// getSortAndLimitOptions() {
//   if (!this.props.groupings.length || !this.props.groupReducer) return null

//   let options = [
//     {value: "desc", name: "Count DESC"},
//     {value: "asc", name: "Count ASC"},
//     {value: "namedesc", name: "Name DESC"},
//     {value: "nameasc", name: "Name ASC"},
//   ]

//   if (this.props.groupings.length > 1) {
//     options = options.concat([
//       {value: "pathdesc", name: "Path DESC"},
//       {value: "pathasc", name: "Path ASC"},
//     ])
//   }

//   if (this.props.groupings.length === 1) {
//     options = options.concat([
//       {value: "natural", name: "Natural"},
//     ])
//   }

//   const combineRemainderInput = (this.props.groupLimit) ? (
//     <label className="checkbox-label">
//       <input
//         type="checkbox"
//         name="combineRemainder"
//         checked={this.props.combineRemainder}
//         onChange={this.onCombineRemainderChange}
//       />
//       Combine remainder
//     </label>) : null

//   return (
//     <span>
//       <select onChange={this.onSortChange} value={this.props.groupSort || ""}>
//         {options.map(function(option) {
//           return <option key={option.value} value={option.value}>{option.name}</option>
//         })}
//       </select>
//       <select onChange={this.onLimitChange} value={this.props.groupLimit || ""}>
//         <option value="">Show all</option>
//         <option value="1">1</option>
//         <option value="2">2</option>
//         <option value="3">3</option>
//         <option value="5">5</option>
//         <option value="8">8</option>
//         <option value="10">10</option>
//         <option value="12">12</option>
//         <option value="15">15</option>
//         <option value="20">20</option>
//         <option value="25">25</option>
//         <option value="50">50</option>
//         <option value="75">75</option>
//         <option value="100">100</option>
//         <option value="150">150</option>
//         <option value="200">200</option>
//         <option value="250">250</option>
//         <option value="500">500</option>
//       </select>
//       {combineRemainderInput}
//     </span>
//   )
// },

// getGroupReducerOption() {
//   if (!this.props.groupings || !this.props.groupings.length) return null
//   const value = this.props.groupReducer ? this.props.groupReducer.name : ""

//   return (
//     <select onChange={this.onGroupReducerChange} value={value}>
//       <option value="">Reduce by</option>
//       <option value="count">Length</option>
//       <option value="percentage">Percentage</option>
//     </select>
//   )
// },
