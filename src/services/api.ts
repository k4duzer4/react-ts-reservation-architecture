import axios from 'axios'

const envApiUrl = import.meta.env.VITE_API_URL?.trim()
const hostname = window.location.hostname
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'
const defaultBaseUrl = isLocalhost ? 'http://localhost:3001' : '/api'

const api = axios.create({
  baseURL: envApiUrl || defaultBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

export { api }
