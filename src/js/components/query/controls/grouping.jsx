const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")

const GroupingModal = require("./grouping-modal")

const GroupingControl = createReactClass({
  displayName: "GroupingControl",

  propTypes: {
    groupings: PropTypes.array,
    options: PropTypes.array.isRequired,
    groupReducer: PropTypes.object,
    groupSort: PropTypes.string.isRequired,
    groupLimit: PropTypes.number,
    combineRemainder: PropTypes.bool.isRequired,
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onGroupReducerChange: PropTypes.func.isRequired,
    onGroupSortChange: PropTypes.func.isRequired,
    onGroupLimitChange: PropTypes.func.isRequired,
    onCombineRemainderChange: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      modalOpen: false,
    }
  },

  onAdd(e) {
    this.props.onAdd(e.target.value)
  },

  getRows() {
    return this.props.groupings.map(function(grouping) {
      return (
        <div className="row" key={grouping}>
          <div className="grouping">
            {grouping}
            <a className="site-link" onClick={this.props.onRemove.bind(this, grouping)}>remove</a>
          </div>
        </div>
      )
    }.bind(this))
  },

  getGroupingModal() {
    if (!this.state.modalOpen) return null

    return (
      <GroupingModal
        onDismiss={this.closeModal}
        onGroupReducerChange={this.props.onGroupReducerChange}
        onGroupSortChange={this.props.onGroupSortChange}
        onGroupLimitChange={this.props.onGroupLimitChange}
        onCombineRemainderChange={this.props.onCombineRemainderChange}
        groupings={this.props.groupings}
        groupReducer={this.props.groupReducer}
        groupSort={this.props.groupSort}
        groupLimit={this.props.groupLimit}
        combineRemainder={this.props.combineRemainder}
      />
    )
  },

  showModal() {
    document.body.classList.toggle("modal-open")
    this.setState({modalOpen: true})
  },

  closeModal() {
    document.body.classList.toggle("modal-open")
    this.setState({modalOpen: false})
  },

  getGroupingOptionsLink() {
    if (!this.props.groupings.length) return null
    return <div><a className="site-link" onClick={this.showModal}>Grouping options</a></div>
  },

  render() {
    const options = this.props.options.map(function(value) {
      return (
        <option value={value} key={value}>{value}</option>
      )
    })

    return (
      <div className="input-control">
        <label>Group By:</label>
        <div className="body">
          {this.getRows()}
          <div className="row">
            <select onChange={this.onAdd} value="">
              <option></option>
              {options}
            </select>
          </div>
        </div>
        {this.getGroupingOptionsLink()}
        {this.getGroupingModal()}
      </div>
    )
  },
})

module.exports = GroupingControl
