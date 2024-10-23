import { axiosInstance } from "@/configs/configs";
import { Bank, IBank } from "@/entities/bank.entity";
import { AxiosResponse } from "axios";
import { isNumber } from "lodash";
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

	fetchBanks = async () => {
		return axiosInstance.get("/banks").then((res: AxiosResponse<IBank[]>) => {
			this._banks = res.data.map((bank) => new Bank(bank));
		});
	};

	updateFilter = (query: string) => {
		this._query = query;
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

	fetchBank = async (id: string) => {
		return axiosInstance.get(`/banks/${id}`).then((res) => {
			return new Bank(res.data);
		});
	};

	createBank = async (bank: Partial<IBank>) => {
		return axiosInstance.post("/banks", bank).then(async (res) => {
			const bank = await this.fetchBank(res.data.id);
			this._banks?.push(bank);
		});
	};

	updateBank = async (id: string, bank: Partial<IBank>) => {
		return axiosInstance.patch(`/banks/${id}`, bank).then(async () => {
			const bank = await this.fetchBank(id);
			const bankIndex = this._banks?.findIndex((b) => b.id === id);

			if (isNumber(bankIndex) && bankIndex >= 0 && this._banks) {
				this._banks[bankIndex].updateBank(bank);
			}
		});
	};
}
