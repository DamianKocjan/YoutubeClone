import axios from 'axios';
import type { AxiosResponse, Method } from 'axios';
import { Cookies } from 'react-cookie';

import { createAccessTokenCookie, createRefreshTokenCookie } from './cookies';

const baseURL = 'http://127.0.0.1:8000/api/';
const cookies = new Cookies();

export const api = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    Authorization: cookies.get('access_token')
      ? `Bearer ${cookies.get('access_token')}`
      : null,
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops early
    if (
      error.response.status === 401 &&
      originalRequest.url === `${baseURL}token/refresh/`
    ) {
      window.location.href = '/login/';

      return Promise.reject(error);
    }

    if (
      error.response.data.code === 'token_not_valid' &&
      error.response.status === 401 &&
      error.response.statusText === 'Unauthorized'
    ) {
      const refreshToken = cookies.get('refresh_token');

      if (refreshToken) {
        const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

        // exp date in token is expressed in seconds, while now() returns milliseconds:
        const now = Math.ceil(Date.now() / 1000);

        if (tokenParts.exp > now) {
          try {
            const response = await api.post('token/refresh/', {
              refresh: refreshToken,
            });

            createAccessTokenCookie(response.data.access);
            createRefreshTokenCookie(response.data.refresh);

            api.defaults.headers.Authorization = `Bearer ${response.data.access}`;
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

            return await api(originalRequest);
          } catch (err) {
            cookies.remove('access_token', { path: '/' });
            cookies.remove('refresh_token', { path: '/' });

            console.error(err);
          }
        }
        window.location.href = '/login/';
      } else {
        window.location.href = '/login/';
      }
    }

    // specific error handling done elsewhere
    return Promise.reject(error);
  }
);

export const request = <T>(
  method: Method,
  url: string,
  params?: unknown
): Promise<AxiosResponse<T>> => {
  return api.request<T>({
    method,
    url,
    params,
  });
};

// Define a default query function that will receive the query key
export const defaultQueryFn = async ({ queryKey }: any): Promise<unknown> => {
  const data = await request(queryKey[0], queryKey[1], queryKey[2]);
  return data;
};
