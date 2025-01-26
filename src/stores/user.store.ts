import { AxiosAuthInterceptor, axiosInstance } from "@/configs/configs";
import { AxiosResponse } from "axios";
import { action, makeAutoObservable, runInAction } from "mobx";
import { RootStore } from ".";

interface IUser {
	username: string;
}

export class UserStore {
	rootStore: RootStore;
	authenticated: boolean = false;
	user: IUser = {} as IUser;
	initialising: boolean = true;
	tz: string = Intl.DateTimeFormat().resolvedOptions().timeZone;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this);
	}

	@action
	updateTimezone = (tz: string) => {
		this.tz = tz;
	};

	initialize = async () => {
		const token = localStorage.getItem("token");
		const rememberMe = localStorage.getItem("remember_me") === "true";
		if (rememberMe && token) {
			AxiosAuthInterceptor.addBearerTokenInterceptor(token);
			await axiosInstance
				.get("/admin/user")
				.then((res: AxiosResponse<IUser>) => {
					runInAction(() => {
						this.authenticated = true;
						this.user = res.data;
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
						user: IUser;
						token: string;
					}>
				) => {
					runInAction(() => {
						const { user, token } = res.data;
						this.user = user;
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
