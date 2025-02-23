import { axiosInstance } from "@/configs/configs";
import { ActiveStatusType, ChannelType } from "@/ts/api.types";
import { Translation } from "@/ts/helpers.types";
import { makeAutoObservable, runInAction } from "mobx";
import { ICategory } from "./entities";

export interface IOffer {
	id: string;
	terms_and_conditions: Translation;
	starting_date?: Date;
	expiry_date: string;
	minimum_amount?: number;
	description: Translation;
	cap?: number;
	discount_code?: string;
	logo?: string;
	channels: ChannelType[];
	bankId: string;
	categories: ICategory[];
	applicable_cards: string[];
	offer_source_link: string;
	status: ActiveStatusType;
	title: Translation;
}

export class Offer {
	id: string;
	bankId: string;
	title: Translation;
	terms_and_conditions: Translation;
	starting_date?: Date;
	expiry_date: string;
	minimum_amount?: number;
	description: Translation;
	cap?: number;
	discount_code?: string;
	logo?: string;
	channels: ChannelType[];
	categories: ICategory[];
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
		this.channels = offer.channels;
		this.categories = offer.categories;
		this.applicable_cards = offer.applicable_cards;
		this.offer_source_link = offer.offer_source_link;
		this.status = offer.status;
		this.title = offer.title;
		this.bankId = offer.bankId;
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
		this.channels = offer.channels;
		this.categories = offer.categories;
		this.applicable_cards = offer.applicable_cards;
		this.offer_source_link = offer.offer_source_link;
		this.status = offer.status;
		this.title = offer.title;
		this.bankId = offer.bankId;
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
