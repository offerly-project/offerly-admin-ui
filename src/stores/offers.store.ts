import { axiosInstance } from "@/configs/configs";
import { IOffer, Offer } from "@/entities/offer.entity";
import { AxiosResponse } from "axios";
import { makeAutoObservable } from "mobx";
import { RootStore } from ".";

type Query = {
	cards: string[];
	categories: string[];
};

export class OffersStore {
	private rootStore: RootStore;
	private _offers: Record<string, Offer> = {};
	query: Query = {
		cards: [],
		categories: [],
	};
	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this);
	}

	fetchOffers = async () => {
		const res: AxiosResponse<IOffer[]> = await axiosInstance.get("/offers");
		this._offers = res.data.reduce((acc, offer) => {
			acc[offer.id] = new Offer(offer);
			return acc;
		}, {} as { [id: string]: Offer });
	};

	get offers() {
		let offers = Object.values(this._offers);
		if (this.query.cards.length) {
			offers = offers.filter((offer) =>
				this.query.cards.some((card) => offer.applicable_cards.includes(card))
			);
		}
		if (this.query.categories.length) {
			offers = offers.filter((offer) =>
				this.query.categories.some((category) =>
					offer.categories.includes(category)
				)
			);
		}
		return offers;
	}

	setCardsQuery = (cards: string[]) => {
		this.query.cards = cards;
	};

	setCategoriesQuery = (categories: string[]) => {
		this.query.categories = categories;
	};
}
