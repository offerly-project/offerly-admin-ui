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
