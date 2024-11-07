import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
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
