import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

// https://backend-warehouse-orzu-production.up.railway.app
// http://localhost:3001

const clientApi = axios.create({
  baseURL: 'https://backend-warehouse-orzu-production.up.railway.app',
  // baseURL: 'http://localhost:3001',
})

clientApi.interceptors.request.use(
  <T>(config: InternalAxiosRequestConfig<T>) => {
    // 1. Добавляем API-ключ в заголовок 'x-api-key'
    config.headers['x-api-key'] = 'telegram_bot_key_456'

    // 2. Если в будущем вернете авторизацию по токену, раскомментируйте это:
    // const authToken = localStorage.getItem('AUTH_TOKEN') // Убедитесь, что используете getItem
    // if (authToken) {
    //   config.headers['Authorization'] = `Bearer ${authToken}`
    // }

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