import { BankType } from "@/entities/bank.entity";
import { Toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

export const createErrorToastObject = (err: Error): Toast => {
	const defaultErrorMessage = "An error has occurred";

	if (err instanceof AxiosError) {
		const message = err.response?.data?.message || defaultErrorMessage;
		return {
			title: "Error",
			description: message,
			variant: "destructive",
		};
	}

	return { title: "Error", description: defaultErrorMessage };
};

export const formatAssetPath = (path: string) =>
	`${import.meta.env.VITE_API_BASE_URL}/static${path}`;

export const createFileObject = async (url: string) => {
	if (!url) return null;
	const response = await fetch(url);
	const blob = await response.blob();
	return new File([blob], "image.png", { type: "image/png" });
};

export const formatBankType = (type: BankType) => {
	switch (type) {
		case "digital":
			return "Digital";
		case "digital-wallet":
			return "Digital Wallet";
		case "regular":
			return "Regular";
	}
};
