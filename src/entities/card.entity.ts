import { axiosInstance } from "@/configs/configs";
import { ActiveStatusType } from "@/ts/api.types";
import { Translation } from "@/ts/helpers.types";
import { makeAutoObservable, runInAction } from "mobx";
import { IBank } from "./bank.entity";

export interface ICard {
	name: Translation;
	bank: IBank;
	logo: string;
	grade: Translation;
	scheme: Translation;
	status: ActiveStatusType;
	offers: string[];
	id: string;
}

export class Card {
	name: Translation;
	bank: IBank;
	logo: string;
	grade: Translation;
	scheme: Translation;
	status: ActiveStatusType;
	offers: string[];
	id: string;

	constructor(card: ICard) {
		this.name = card.name;
		this.bank = card.bank;
		this.logo = card.logo;
		this.grade = card.grade;
		this.scheme = card.scheme;
		this.status = card.status;
		this.offers = card.offers;
		this.id = card.id;
		makeAutoObservable(this);
	}
	updateStatus = async (status: ActiveStatusType) => {
		return axiosInstance
			.patch(`/admin/cards/${this.id}`, { status })
			.then(() => {
				runInAction(() => {
					this.status = status;
				});
			});
	};

	updateCard = async (card: Partial<ICard>) => {
		this.name = card.name || this.name;
		this.bank = card.bank || this.bank;
		this.logo = card.logo || this.logo;
		this.grade = card.grade || this.grade;
		this.scheme = card.scheme || this.scheme;
		this.status = card.status || this.status;
		this.offers = card.offers || this.offers;
		this.id = card.id || this.id;
	};
}
