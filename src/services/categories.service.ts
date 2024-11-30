import { axiosInstance } from "@/configs/configs";
import { ListItem } from "@/ts/helpers.types";

export class CategoriesService {
	static categories: string[];
	static list: ListItem<string>[];
	static populate = async () => {
		if (!CategoriesService.categories) {
			const response = await axiosInstance.get("/static/categories.json");
			const data = response ? response.data : [];

			CategoriesService.categories = data;

			CategoriesService.list = data.map((category: string) => ({
				value: category,
				name: category,
			}));
		}
	};
}
