import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const api: AxiosInstance = axios.create({
    timeout: 10000,
});

const get = async <T>(
    apiUrl: string,
    endpoint: string,
    queries?: Record<string, any>
): Promise<AxiosResponse<T>> => {
    try {
        const config: AxiosRequestConfig = {
            baseURL: apiUrl,
            url: endpoint,
            method: "get",
            params: queries,
        };
        return await api.request<T>(config);
    } catch (error) {
        console.error("API Request Error:", error);
        throw error;
    }
};

export default {get}