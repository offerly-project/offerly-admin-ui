import { axiosInstance } from "@/configs/configs";
import { AxiosResponse } from "axios";
import { makeAutoObservable } from "mobx";
import { RootStore } from ".";

interface IUser {
	username: string;
}

export class UserStore {
	rootStore: RootStore;
	authenticated: boolean = true;
	user: IUser = {
		username: "jad",
	};

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
			.then((res: AxiosResponse<{ user: string }>) => {
				const { user } = res.data;
				this.user = {
					username: user,
				};

				this.authenticated = true;
			});
	}
}
