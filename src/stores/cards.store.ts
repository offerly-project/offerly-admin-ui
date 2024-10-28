import { axiosInstance } from "@/configs/configs";
import { Card, ICard } from "@/entities/card.entity";
import { CardFormValues } from "@/features/Cards/CardForm";
import { AxiosResponse } from "axios";
import { isNumber } from "lodash";
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

	fetchCard = async (id: string) => {
		return axiosInstance.get(`/cards/${id}`).then((res) => {
			return new Card(res.data);
		});
	};

	createCard = async (card: CardFormValues) => {
		const bank = this.rootStore.banksStore.banks.find(
			(bank) => bank.name === card.bank
		)!;
		card.bank = bank.id;
		return axiosInstance.post("/cards", card).then(async (res) => {
			const card = await this.fetchCard(res.data.id);
			runInAction(() => {
				if (!this._cards[card.bank.id]) {
					this._cards[card.bank.id] = [];
				}
				this._cards[card.bank.id].push(card);
			});
		});
	};

	updateCard = async (id: string, card: Partial<CardFormValues>) => {
		if (!card.logo) {
			delete card.logo;
		}
		const bank = this.rootStore.banksStore.banks.find(
			(bank) => bank.name === card.bank
		)!;
		card.bank = bank.id;
		return axiosInstance.patch(`/cards/${id}`, card).then(async () => {
			const card = await this.fetchCard(id);
			const bankIndex = this._cards[card.bank.id].findIndex((b) => b.id === id);

			if (isNumber(bankIndex) && bankIndex >= 0 && this._cards[card.bank.id]) {
				this._cards[card.bank.id][bankIndex].updateCard(card);
			}
		});
	};
}
