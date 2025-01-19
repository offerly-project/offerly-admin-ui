import { axiosInstance } from "@/configs/configs";
import { ActiveStatusType } from "@/ts/api.types";
import { Translation } from "@/ts/helpers.types";
import { makeAutoObservable, runInAction } from "mobx";

export type BankType = "regular" | "digital" | "digital-wallet";

export interface IBank {
	country: string;
	type: BankType;
	name: Translation;
	logo: string;
	status: ActiveStatusType;
	cards: string[];
	id: string;
	scrapper_id: string;
}

export class Bank {
	country: string;
	type: BankType;
	name: Translation;
	logo: string;
	status: ActiveStatusType;
	cards: string[];
	id: string;
	scrapper_id: string;

	constructor(bank: IBank) {
		this.country = bank.country;
		this.type = bank.type;
		this.name = bank.name;
		this.logo = bank.logo;
		this.status = bank.status;
		this.cards = bank.cards;
		this.id = bank.id;
		this.scrapper_id = bank.scrapper_id;
		makeAutoObservable(this);
	}

	updateBank = (bank: Partial<IBank>) => {
		this.country = bank.country || this.country;
		this.type = bank.type || this.type;
		this.name = bank.name || this.name;
		this.logo = bank.logo || this.logo;
		this.status = bank.status || this.status;
		this.cards = bank.cards || this.cards;
		this.id = bank.id || this.id;
	};

	updateStatus = (status: ActiveStatusType) => {
		return axiosInstance
			.patch(`/admin/banks/${this.id}`, { status })
			.then(() => {
				runInAction(() => {
					this.status = status;
				});
			});
	};
}
