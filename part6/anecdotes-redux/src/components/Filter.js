import { connect } from 'react-redux'
import { setFilter } from '../reducers/filterReducer'

const Filter = ({ filter, setFilter }) => (
    <input placeholder="filter" style={{marginBottom: 16}} value={filter} onChange={e => setFilter(e.target.value)} />
)

const mapStateToProps = ({ filter }) => {
    return { filter }
}

const ConnectedFilter = connect(mapStateToProps, { setFilter })(Filter)
export default ConnectedFilter