import { axiosInstance } from "@/configs/configs";
import { ActiveStatusType } from "@/ts/api.types";
import { createFileObject, formatAssetPath } from "@/utils/utils";
import { makeAutoObservable, runInAction } from "mobx";

export type BankType = "regular" | "digital" | "digital-wallet";

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
	logoFile: File | null = null;

	constructor(bank: IBank) {
		this.country = bank.country;
		this.type = bank.type;
		this.name = bank.name;
		this.logo = bank.logo;
		this.status = bank.status;
		this.cards = bank.cards;
		this.id = bank.id;
		createFileObject(formatAssetPath(this.logo)).then((file) => {
			runInAction(() => {
				this.logoFile = file;
			});
		});
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
		createFileObject(formatAssetPath(this.logo)).then((file) => {
			runInAction(() => {
				this.logoFile = file;
				console.log(this.logoFile);
			});
		});
	};

	updateStatus = (status: ActiveStatusType) => {
		return axiosInstance.patch(`/banks/${this.id}`, { status }).then(() => {
			runInAction(() => {
				this.status = status;
			});
		});
	};
}
