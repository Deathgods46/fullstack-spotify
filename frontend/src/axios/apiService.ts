import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { AUTH_LOCAL_STORAGE_KEY } from '../constants/globalConstants';
import { LANDING_PAGE } from '../routes/routePages';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_DATABASE_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = LANDING_PAGE;
    }
    return Promise.reject(error);
  },
);

export const get = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  try {
    const response = await apiClient.get<T>(url, config);
    return response;
  } catch (error) {
    throw error;
  }
};

export const post = async <T, U>(
  url: string,
  data: U,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  try {
    const response = await apiClient.post<T>(url, data, config);
    return response;
  } catch (error) {
    throw error;
  }
};

export const put = async <T, U>(
  url: string,
  data: U,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  try {
    const response = await apiClient.put<T>(url, data, config);
    return response;
  } catch (error) {
    throw error;
  }
};

export const del = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  try {
    const response = await apiClient.delete<T>(url, config);
    return response;
  } catch (error) {
    throw error;
  }
};
