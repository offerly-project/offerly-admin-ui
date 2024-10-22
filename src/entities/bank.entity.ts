import { axiosInstance } from "@/configs/configs";
import { ActiveStatusType } from "@/ts/api.types";
import { makeAutoObservable, runInAction } from "mobx";

export type BankType = "regular" | "digital" | "digital-wawllet";

export interface IBank {
	country: string;
	type: BankType;
	name: string;
	logo: string;
	status: ActiveStatusType;
	cards: string[];
	id: string;
}

export class Bank {
	country: string;
	type: BankType;
	name: string;
	logo: string;
	status: ActiveStatusType;
	cards: string[];
	id: string;

	constructor(bank: IBank) {
		this.country = bank.country;
		this.type = bank.type;
		this.name = bank.name;
		this.logo = bank.logo;
		this.status = bank.status;
		this.cards = bank.cards;
		this.id = bank.id;
		makeAutoObservable(this);
	}

	updateStatus = (status: ActiveStatusType) => {
		axiosInstance.patch(`/banks/${this.id}`, { status }).then(() => {
			runInAction(() => {
				this.status = status;
			});
		});
	};
}
