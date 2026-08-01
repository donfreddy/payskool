import axios from 'axios'
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios'

// =============================================================================
// PAYSKOOL — Shared API Client Factory
// Creates a pre-configured Axios instance with auth interceptors
// =============================================================================

export interface ApiClientConfig {
  baseURL: string
  getToken: () => string | null
  onUnauthorized?: () => void
}

export function createApiClient({
  baseURL,
  getToken,
  onUnauthorized,
}: ApiClientConfig): AxiosInstance {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    timeout: 15000,
  })

  // ---- Request Interceptor: Attach JWT Token ----
  client.interceptors.request.use(
    (config) => {
      const token = getToken()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  // ---- Response Interceptor: Handle Global Errors (like 401) ----
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401 && onUnauthorized) {
        onUnauthorized()
      }
      return Promise.reject(error)
    },
  )

  return client
}
