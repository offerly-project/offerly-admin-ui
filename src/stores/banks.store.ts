import { axiosInstance } from "@/configs/configs";
import { Bank, IBank } from "@/entities/bank.entity";
import { AxiosResponse } from "axios";
import { makeAutoObservable } from "mobx";
import { RootStore } from ".";

export class BanksStore {
	private rootStore: RootStore;
	private _banks: Bank[] | null = null;
	private _query: string = "";
	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this);
	}

	fetchBanks = () => {
		return axiosInstance.get("/banks").then((res: AxiosResponse<IBank[]>) => {
			this._banks = res.data.map((bank) => new Bank(bank));
		});
	};

	updateFilter = (query: string) => {
		this._query = query;
	};

	shouldFetch = () => {
		return this._banks === null;
	};

	get banks() {
		if (!this._banks) return [];
		const banks = this._banks;

		if (this._query) {
			return banks.filter((bank) =>
				bank.name.toLowerCase().includes(this._query.toLowerCase())
			);
		}
		return banks;
	}
}
