/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios'
const baseUrl = '/api/login'

const login = (data) => axios.post(baseUrl, data).then(res => res.data)

export default login