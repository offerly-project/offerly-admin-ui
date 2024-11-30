import { axiosInstance } from "@/configs/configs";
import { ListItem } from "@/ts/helpers.types";

export class CountriesService {
	static countries: string[];
	static list: ListItem<string>[];
	static async populate() {
		if (!CountriesService.countries) {
			const response = await axiosInstance.get("/static/countries.json");

			const data = response ? response.data : [];

			CountriesService.countries = data;

			CountriesService.list = data.map((country: string) => ({
				value: country,
				name: country,
			}));
		}
	}
}
