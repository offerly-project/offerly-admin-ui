import { BankType } from "@/entities/bank.entity";
import { ListItem } from "@/ts/helpers.types";

export const BANK_TYPES_LIST: ListItem<BankType>[] = [
	{
		name: "Regular",
		value: "regular",
	},
	{
		name: "Digital",
		value: "digital",
	},
	{ name: "Digital Wallet", value: "digital-wallet" },
];
