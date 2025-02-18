import { axiosInstance } from "@/configs/configs";
import { IOffer, Offer } from "@/entities/offer.entity";
import { OfferFormValues } from "@/features/Offers/OfferForm";
import { AxiosResponse } from "axios";
import { isNumber, omit } from "lodash";
import { makeAutoObservable, runInAction } from "mobx";
import momentTz from "moment-timezone";
import { RootStore } from ".";

type OfferPayload = Omit<OfferFormValues, "starting_date" | "expiry_date"> & {
	starting_date?: Date;
	expiry_date?: Date;
};

type Query = {
	cards: string[];
	categories: string[];
	search: string;
	banks: string[];
};

export class OffersStore {
	private rootStore: RootStore;
	private _offers: Record<string, Offer> = {};
	query: Query = {
		cards: [],
		categories: [],
		search: "",
		banks: [],
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
		const tz = this.rootStore.userStore.tz;
		const payload: OfferPayload = {
			...omit(data, ["starting_date", "expiry_date"]),
		};

		if (data.starting_date) {
			payload.starting_date = momentTz(data.starting_date).toDate();
		}
		if (data.expiry_date) {
			const parsedDate = momentTz(data.expiry_date, "DD/MM/YYYY", true);
			payload.expiry_date = parsedDate.tz(tz).toDate();
		}

		const id = await axiosInstance
			.post("/admin/offers", payload, {
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
					offer.categories.find((cat) => cat.id === category)
				)
			);
		}

		if (this.query.banks.length) {
			offers = offers.filter((offer) =>
				this.query.banks.some((bank) => offer.bank.id === bank)
			);
		}

		if (this.query.search) {
			offers = offers.filter(
				(offer) =>
					offer.title.en
						.toLowerCase()
						.includes(this.query.search.toLowerCase()) ||
					offer.title.ar.toLowerCase().includes(this.query.search.toLowerCase())
			);
		}

		return offers;
	}

	setSearchQuery = (search: string) => {
		this.query.search = search;
	};

	setCardsQuery = (cards: string[]) => {
		this.query.cards = cards;
	};

	setBanksQuery = (banks: string[]) => {
		this.query.banks = banks;
	};

	setCategoriesQuery = (categories: string[]) => {
		this.query.categories = categories;
	};

	updateOffer = async (id: string, data: OfferFormValues) => {
		const tz = this.rootStore.userStore.tz;
		const payload: OfferPayload = {
			...omit(data, ["starting_date", "expiry_date"]),
		};
		if (data.starting_date) {
			payload.starting_date = momentTz(data.starting_date).tz(tz).toDate();
		}
		if (data.expiry_date) {
			const parsedDate = momentTz(data.expiry_date, "DD/MM/YYYY", true);
			payload.expiry_date = parsedDate.tz(tz).toDate();
		}

		await axiosInstance.patch(`/admin/offers/${id}`, payload);
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
