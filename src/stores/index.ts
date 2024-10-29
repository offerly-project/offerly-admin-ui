import { makeAutoObservable } from "mobx";
import { BanksStore } from "./banks.store";
import { CardsStore } from "./cards.store";
import { OffersStore } from "./offers.store";
import { UserStore } from "./user.store";

export class RootStore {
	userStore: UserStore;
	banksStore: BanksStore;
	cardsStore: CardsStore;
	offersStore: OffersStore;
	constructor() {
		this.userStore = new UserStore(this);
		this.banksStore = new BanksStore(this);
		this.cardsStore = new CardsStore(this);
		this.offersStore = new OffersStore(this);
		makeAutoObservable(this);
	}
}

const rootStore = new RootStore();

export const userStore = () => rootStore.userStore;

export const banksStore = () => rootStore.banksStore;

export const cardsStore = () => rootStore.cardsStore;

export const offersStore = () => rootStore.offersStore;
