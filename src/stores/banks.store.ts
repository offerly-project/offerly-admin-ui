import { axiosInstance } from "@/configs/configs";
import { Bank, IBank } from "@/entities/bank.entity";
import { AxiosResponse } from "axios";
import { makeAutoObservable } from "mobx";
import { RootStore } from ".";

export class BanksStore {
	private rootStore: RootStore;
	private _banks: Record<string, Bank> = {};
	private _query: string = "";

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this);
	}

	fetchBanks = async () => {
		const res: AxiosResponse<IBank[]> = await axiosInstance.get("/banks");
		this._banks = res.data.reduce((acc, bank) => {
			acc[bank.id] = new Bank(bank);
			return acc;
		}, {} as { [id: string]: Bank });
	};

	updateFilter = (query: string) => {
		this._query = query;
	};

	get banks() {
		const banksArray = Object.values(this._banks);
		if (this._query) {
			return banksArray.filter((bank) =>
				bank.name.toLowerCase().includes(this._query.toLowerCase())
			);
		}
		return banksArray;
	}

	get banksList() {
		return Object.values(this._banks).map((bank) => bank.name);
	}

	fetchBank = async (id: string) => {
		const res = await axiosInstance.get(`/banks/${id}`);
		const bank = new Bank(res.data);
		this._banks[id] = bank;
		return bank;
	};

	createBank = async (bank: Partial<IBank>) => {
		if (!bank.logo) {
			delete bank.logo;
		}
		const res = await axiosInstance.post("/banks", bank);
		const newBank = await this.fetchBank(res.data.id);
		this._banks[newBank.id] = newBank;
	};

	updateBank = async (id: string, bank: Partial<IBank>) => {
		if (!bank.logo) {
			delete bank.logo;
		}
		await axiosInstance.patch(`/banks/${id}`, bank);

		const updatedBank = await this.fetchBank(id);
		this._banks[id] = updatedBank;
	};
}
