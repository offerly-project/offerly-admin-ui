import { makeAutoObservable } from "mobx";
import { BanksStore } from "./banks.store";
import { UserStore } from "./user.store";

export class RootStore {
	userStore: UserStore;
	banksStore: BanksStore;
	constructor() {
		this.userStore = new UserStore(this);
		this.banksStore = new BanksStore(this);
		makeAutoObservable(this);
	}
}

const rootStore = new RootStore();

export const userStore = () => rootStore.userStore;

export const banksStore = () => rootStore.banksStore;
