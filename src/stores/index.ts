import { makeAutoObservable } from "mobx";
import { BanksStore } from "./banks.store";
import { CardsStore } from "./cards.store";
import { UserStore } from "./user.store";

export class RootStore {
	userStore: UserStore;
	banksStore: BanksStore;
	cardsStore: CardsStore;
	constructor() {
		this.userStore = new UserStore(this);
		this.banksStore = new BanksStore(this);
		this.cardsStore = new CardsStore(this);
		makeAutoObservable(this);
	}
}

const rootStore = new RootStore();

export const userStore = () => rootStore.userStore;

export const banksStore = () => rootStore.banksStore;

export const cardsStore = () => rootStore.cardsStore;
