import { makeAutoObservable } from "mobx";
import { UserStore } from "./user.store";

export class RootStore {
	userStore: UserStore;
	constructor() {
		this.userStore = new UserStore(this);
		makeAutoObservable(this);
	}
}

const rootStore = new RootStore();

export const userStore = () => rootStore.userStore;
