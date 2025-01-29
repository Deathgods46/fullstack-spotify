import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { AUTH_LOCAL_STORAGE_KEY } from '../constants/globalConstants';

console.log(process.env.REACT_APP_DATABASE_URL);
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_DATABASE_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem(AUTH_LOCAL_STORAGE_KEY)}`,
  },
});

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
