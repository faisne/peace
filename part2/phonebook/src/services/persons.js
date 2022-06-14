import axios from 'axios'

const baseUrl = '/api/persons'

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data)
}

const get = (id) => {
    return axios.get(`${baseUrl}/${id}`).then(response => response.data)
}
  
const create = newObject => {
    return axios.post(baseUrl, newObject).then(response => response.data)
}

const update = (id, newPerson) => {
    return axios.put(`${baseUrl}/${id}`, newPerson).then(response => response.data)
}

const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

const pbService = { getAll, get, create, update, remove }
export default pbService