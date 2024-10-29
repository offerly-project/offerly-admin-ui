import { axiosInstance } from "@/configs/configs";
import { IOffer, Offer } from "@/entities/offer.entity";
import { AxiosResponse } from "axios";
import { makeAutoObservable } from "mobx";
import { RootStore } from ".";

export class OffersStore {
	private rootStore: RootStore;
	private _offers: Record<string, Offer> = {};
	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this);
	}

	fetchOffers = async () => {
		const res: AxiosResponse<IOffer[]> = await axiosInstance.get("/offers");
		this._offers = res.data.reduce((acc, offer) => {
			acc[offer.id] = new Offer(offer);
			return acc;
		}, {} as { [id: string]: Offer });
	};

	get offers() {
		return Object.values(this._offers);
	}
}
