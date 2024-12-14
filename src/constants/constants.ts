import { z } from "zod";

export const NUMBER_PATTERN = /^[0-9]+$/;

export const languagesSchema = z.object({
	en: z
		.string({ message: "English  is required" })
		.min(1, "English  is required"),
	ar: z
		.string({ message: "Arabic  is required" })
		.min(1, "Arabic  is required"),
});

export const expiryDateSchema = z.string().refine(
	(value) => {
		if (!value) return false;
		const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;
		return dateRegex.test(value);
	},
	{
		message: "Invalid date format or value. Use DD/MM/YYYY.",
	}
);
