import axios from "axios";

export const isProduction = import.meta.env.MODE === "production";

export const BASE_URL = isProduction
	? "https://offerly.me/api"
	: import.meta.env.VITE_API_BASE_URL;

export const axiosInstance = axios.create({
	baseURL: BASE_URL,
	timeout: 10 * 60 * 1000,
});

export class AxiosAuthInterceptor {
	private static _id: number;
	static addBearerTokenInterceptor = (token: string) => {
		this._id = axiosInstance.interceptors.request.use((config) => {
			config.headers.Authorization = `Bearer ${token}`;
			return config;
		});
	};

	static removeBearerTokenInterceptor = () => {
		axiosInstance.interceptors.request.eject(this._id);
	};
}
