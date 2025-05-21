import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

const clientApi = axios.create({
  baseURL: 'https://backend-warehouse-orzu-production.up.railway.app',
})

clientApi.interceptors.request.use(
  <T>(config: InternalAxiosRequestConfig<T>) => {
//     const authToken = localStorage.get(TOKEN.AUTH_TOKEN)
//     config.headers['authorization'] = authToken ? `Bearer ${authToken}` : null
    return config
  }
)

clientApi.interceptors.response.use(
  <T>(response: AxiosResponse<T>) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login' 
    }
    return Promise.reject(error)
  }
)

export default clientApi
