import { axiosInstance } from "@/configs/configs";
import { ListItem } from "@/ts/helpers.types";

export class CountriesService {
	static countries: string[];
	static list: ListItem<string>[];
	static async populate() {
		if (!CountriesService.countries) {
			const response = await axiosInstance.get("/static/countries.json");

			CountriesService.countries = response.data;

			CountriesService.list = response.data.map((country: string) => ({
				value: country,
				name: country,
			}));
		}
	}
}
