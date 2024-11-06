import { axiosInstance } from "@/configs/configs";
import { IOffer, Offer } from "@/entities/offer.entity";
import { OfferFormValues } from "@/features/Offers/OfferForm";
import { AxiosResponse } from "axios";
import { isNumber } from "lodash";
import { makeAutoObservable, runInAction } from "mobx";
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
		const res: AxiosResponse<IOffer[]> = await axiosInstance.get(
			"/admin/offers"
		);
		this._offers = res.data.reduce((acc, offer) => {
			acc[offer.id] = new Offer(offer);
			return acc;
		}, {} as { [id: string]: Offer });
	};

	fetchOfferById = async (id: string) => {
		const res: AxiosResponse<IOffer> = await axiosInstance.get(
			`/admin/offers/${id}`
		);
		const offer = res.data;
		return offer;
	};

	createOffer = async (data: OfferFormValues) => {
		const id = await axiosInstance
			.post("/admin/offers", data, {
				headers: {
					"Content-Type": "application/json",
				},
				transformRequest: (data: OfferFormValues) => {
					const { cap, minimum_amount, ...rest } = data;

					const transformedData = {
						...rest,
						...(isNumber(cap) ? { cap: +cap } : {}),
						...(isNumber(minimum_amount)
							? { minimum_amount: +minimum_amount }
							: {}),
					};

					return JSON.stringify(transformedData);
				},
			})
			.then((res: AxiosResponse<{ id: string }>) => res.data.id);

		const offer = await this.fetchOfferById(id);
		runInAction(() => {
			this._offers[offer.id] = new Offer(offer);
		});
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

	updateOffer = async (id: string, data: OfferFormValues) => {
		await axiosInstance.patch(`/admin/offers/${id}`, data);
		const offer = await this.fetchOfferById(id);
		runInAction(() => {
			this._offers[id].updateOffer(offer);
		});
	};

	deleteOffer = async (id: string) => {
		await axiosInstance.delete(`/admin/offers/${id}`);
		runInAction(() => {
			delete this._offers[id];
		});
	};
}
