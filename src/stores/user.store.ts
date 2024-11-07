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

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this);
	}

	async login(username: string, password: string) {
		return axiosInstance
			.post(
				"/admin/auth/login",
				{
					username,
					password,
				},
				{ withCredentials: true }
			)
			.then((res: AxiosResponse<{ user: string; token: string }>) => {
				runInAction(() => {
					const { user, token } = res.data;
					this.user = {
						username: user,
					};

					AxiosAuthInterceptor.addBearerTokenInterceptor(token);

					this.authenticated = true;
				});
			});
	}

	logout() {
		this.authenticated = false;
		AxiosAuthInterceptor.removeBearerTokenInterceptor();
		this.user = {} as IUser;
	}
}
