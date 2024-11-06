import { axiosInstance } from "@/configs/configs";
import { Card, ICard } from "@/entities/card.entity";
import { CardFormValues } from "@/features/Cards/CardForm";
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
	private _cards: Record<string, Card> = {};

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
			.get("/admin/cards")
			.then((res: AxiosResponse<ICard[]>) => res.data);
		runInAction(() => {
			this._cards = cards.reduce((acc, cardData) => {
				const card = new Card(cardData);
				acc[card.id] = card;
				return acc;
			}, {} as Record<string, Card>);
		});
	};

	get cards() {
		let filteredCards = Object.values(this._cards);

		if (this.query.bank && this.query.bank !== "All") {
			filteredCards = filteredCards.filter(
				(card) => card.bank.name === this.query.bank
			);
		}
		if (this.query.search) {
			filteredCards = filteredCards.filter((card) =>
				card.name.toLowerCase().includes(this.query.search.toLowerCase())
			);
		}
		return filteredCards;
	}

	fetchCard = async (id: string) => {
		const res = await axiosInstance.get(`/admin/cards/${id}`);
		const card = res.data;
		return card;
	};

	createCard = async (cardFormData: CardFormValues) => {
		const bank = this.rootStore.banksStore.banks.find(
			(b) => b.name === cardFormData.bank
		)!;
		cardFormData.bank = bank.id;

		const res = await axiosInstance.post("/admin/cards", cardFormData);
		const newCard = await this.fetchCard(res.data.id);
		runInAction(() => {
			this._cards[newCard.id] = new Card(newCard);
		});
	};

	updateCard = async (id: string, cardData: Partial<CardFormValues>) => {
		if (!cardData.logo) delete cardData.logo;
		const bank = this.rootStore.banksStore.banks.find(
			(b) => b.name === cardData.bank
		)!;
		cardData.bank = bank.id;

		await axiosInstance.patch(`/admin/cards/${id}`, cardData);
		const updatedCard = await this.fetchCard(id);
		runInAction(() => {
			this._cards[id].updateCard(updatedCard);
		});
	};
}
