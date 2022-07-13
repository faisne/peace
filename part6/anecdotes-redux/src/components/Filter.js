import { useSelector, useDispatch } from 'react-redux'
import { setFilter } from '../reducers/filterReducer'

const Filter = () => {
    const text = useSelector(state => state.filter)
    const dispatch = useDispatch()

    return (<input placeholder="filter" style={{marginBottom: 16}} value={text} onChange={e => dispatch(setFilter(e.target.value))} />)
}

export default Filter