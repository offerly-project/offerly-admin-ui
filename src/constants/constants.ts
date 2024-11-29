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
