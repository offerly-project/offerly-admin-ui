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
		const res: AxiosResponse<IBank[]> = await axiosInstance.get("/admin/banks");
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
		const res = await axiosInstance.get(`/admin/banks/${id}`);
		const bank = res.data;
		return bank;
	};

	createBank = async (bank: Partial<IBank>) => {
		if (!bank.logo) {
			delete bank.logo;
		}
		const res = await axiosInstance.post("/admin/banks", bank);
		const newBank = await this.fetchBank(res.data.id);
		this._banks[newBank.id] = new Bank(newBank);
	};

	updateBank = async (id: string, bank: Partial<IBank>) => {
		if (!bank.logo) {
			delete bank.logo;
		}
		await axiosInstance.patch(`/admin/banks/${id}`, bank);

		const updatedBank = await this.fetchBank(id);
		this._banks[id].updateBank(updatedBank);
	};
}
