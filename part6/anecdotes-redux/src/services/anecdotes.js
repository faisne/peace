import axios from "axios"

const baseurl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const res = await axios.get(baseurl)
    return res.data
}

const addNew = async (content) => {
    const res = await axios.post(baseurl, { content, votes: 0 })
    return res.data
}

const update = async (id, object) => {
    const res = await axios.put(`${baseurl}/${id}`, object)
    return res.data
}

export default { getAll, addNew, update }