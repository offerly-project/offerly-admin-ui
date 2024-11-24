import { AxiosAuthInterceptor, axiosInstance } from "@/configs/configs";
import { AxiosResponse } from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from ".";

interface IUser {
	username: string;
}

export class UserStore {
	rootStore: RootStore;
	authenticated: boolean = false;
	user: IUser = {} as IUser;
	initialising: boolean = true;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this);
	}

	initialize = async () => {
		const token = localStorage.getItem("token");
		const user = localStorage.getItem("user");
		const rememberMe = localStorage.getItem("remember_me") === "true";
		if (rememberMe && token && user) {
			AxiosAuthInterceptor.addBearerTokenInterceptor(token);
			await axiosInstance
				.get("/admin/auth")
				.then(() => {
					runInAction(() => {
						this.authenticated = true;
						this.user = {
							username: JSON.parse(user),
						};
					});
				})
				.catch(() => {
					AxiosAuthInterceptor.removeBearerTokenInterceptor();
				});
		}
		runInAction(() => {
			this.initialising = false;
		});
	};

	async login(username: string, password: string, rememberMe: boolean) {
		return axiosInstance
			.post(
				"/admin/auth/login",
				{
					username,
					password,
				},
				{ withCredentials: true }
			)
			.then(
				(
					res: AxiosResponse<{
						user: string;
						token: string;
					}>
				) => {
					runInAction(() => {
						const { user, token } = res.data;
						this.user = {
							username: user,
						};
						AxiosAuthInterceptor.addBearerTokenInterceptor(token);
						if (rememberMe) {
							localStorage.setItem("remember_me", "true");
							localStorage.setItem("token", token);
							localStorage.setItem("user", JSON.stringify(user));
						} else {
							localStorage.removeItem("remember_me");
							localStorage.removeItem("token");
							localStorage.removeItem("user");
						}

						this.authenticated = true;
					});
				}
			);
	}

	logout() {
		this.authenticated = false;
		AxiosAuthInterceptor.removeBearerTokenInterceptor();
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		this.user = {} as IUser;
	}
}
