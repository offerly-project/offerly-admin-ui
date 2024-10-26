import { axiosInstance } from "@/configs/configs";
import { Card, ICard } from "@/entities/card.entity";
import { AxiosResponse } from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from ".";

type Query = {
	bank: string;
	search: string;
};

export class CardsStore {
	private rootStore: RootStore;
	query: Query = {
		bank: "All",
		search: "",
	};
	private _cards: Record<string, Card[]> = {};

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this);
	}

	updateFilter = (bank: string) => {
		this.query.bank = bank;
	};

	updateSearch = (search: string) => {
		this.query.search = search;
	};

	fetchCards = async () => {
		const cards = await axiosInstance
			.get("/cards")
			.then((res: AxiosResponse<ICard[]>) => res.data);
		runInAction(() => {
			this._cards = cards.reduce((acc, card) => {
				if (!acc[card.bank.id]) {
					acc[card.bank.id] = [];
				}
				acc[card.bank.id].push(new Card(card));
				return acc;
			}, {} as Record<string, Card[]>);
		});
	};

	get cards() {
		if (!this.query.bank && !this.query.search) {
			return Object.values(this._cards).flat();
		}
		let cards: Card[] = Object.values(this._cards).flat();
		if (this.query.bank && this.query.bank !== "All") {
			cards = cards.filter((card) => card.bank.name === this.query.bank);
		}
		if (this.query.search) {
			cards = cards.filter((card) =>
				card.name.toLowerCase().includes(this.query.search.toLowerCase())
			);
		}
		return cards;
	}
}
