import { axiosInstance } from "@/configs/configs";
import { ActiveStatusType } from "@/ts/api.types";
import { makeAutoObservable, runInAction } from "mobx";

export interface IOffer {
	id: string;
	terms_and_conditions: string;
	starting_date?: Date;
	expiry_date: Date;
	minimum_amount?: number;
	description: string;
	cap?: number;
	discount_code?: string;
	logo?: string;
	channel: "online" | "offline";
	categories: string[];
	applicable_cards: string[];
	offer_source_link: string;
	status: ActiveStatusType;
}

export class Offer {
	id: string;
	terms_and_conditions: string;
	starting_date?: Date;
	expiry_date: Date;
	minimum_amount?: number;
	description: string;
	cap?: number;
	discount_code?: string;
	logo?: string;
	channel: "online" | "offline";
	categories: string[];
	applicable_cards: string[];
	offer_source_link: string;
	status: ActiveStatusType;

	constructor(offer: IOffer) {
		this.id = offer.id;
		this.terms_and_conditions = offer.terms_and_conditions;
		this.starting_date = offer.starting_date;
		this.expiry_date = offer.expiry_date;
		this.minimum_amount = offer.minimum_amount;
		this.description = offer.description;
		this.cap = offer.cap;
		this.discount_code = offer.discount_code;
		this.logo = offer.logo;
		this.channel = offer.channel;
		this.categories = offer.categories;
		this.applicable_cards = offer.applicable_cards;
		this.offer_source_link = offer.offer_source_link;
		this.status = offer.status;
		makeAutoObservable(this);
	}
	updateOffer(offer: IOffer) {
		this.terms_and_conditions = offer.terms_and_conditions;
		this.starting_date = offer.starting_date;
		this.expiry_date = offer.expiry_date;
		this.minimum_amount = offer.minimum_amount;
		this.description = offer.description;
		this.cap = offer.cap;
		this.discount_code = offer.discount_code;
		this.logo = offer.logo;
		this.channel = offer.channel;
		this.categories = offer.categories;
		this.applicable_cards = offer.applicable_cards;
		this.offer_source_link = offer.offer_source_link;
		this.status = offer.status;
	}

	updateStatus = async (status: ActiveStatusType) => {
		return axiosInstance
			.patch(`/admin/offers/${this.id}`, { status })
			.then(() => {
				runInAction(() => {
					this.status = status;
				});
			});
	};
}
