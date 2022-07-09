/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  return axios.get(baseUrl).then(response => response.data)
}

const create = (newObject, token) => {
  const config = { headers: { Authorization: `bearer ${token}` } }
  return axios.post(baseUrl, newObject, config).then(res => res.data)
}

const update = (id, fields) => {
  return axios.put(`${baseUrl}/${id}`, fields).then(res => res.data)
}

const remove = (id, token) => {
  const config = { headers: { Authorization: `bearer ${token}` } }
  return axios.delete(`${baseUrl}/${id}`, config).then(res => res.data)
}

export default { getAll, create, update, remove }