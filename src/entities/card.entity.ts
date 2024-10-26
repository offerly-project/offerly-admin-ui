import { ActiveStatusType } from "@/ts/api.types";
import { makeAutoObservable } from "mobx";
import { IBank } from "./bank.entity";

export interface ICard {
	name: string;
	bank: IBank;
	logo: string;
	grade: string;
	scheme: string;
	status: ActiveStatusType;
	offers: string[];
	id: string;
}

export class Card {
	name: string;
	bank: IBank;
	logo: string;
	grade: string;
	scheme: string;
	status: string;
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
}
