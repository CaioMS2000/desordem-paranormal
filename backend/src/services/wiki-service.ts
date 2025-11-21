import { baseWikiURL } from "@/constants";
import wiki from "wikijs";

export class WikiService {
	public async getAllPageNames() {
		try {
			const pageNames = await wiki({
				apiUrl: `${baseWikiURL}/api.php`,
			}).allPages();

			return pageNames;
		} catch (error) {
			console.log(error, " na GetPageNames");
			return [];
		}
	}

	public async getPage(pageName: string) {
		try {
			const page = await wiki({
				apiUrl: `${baseWikiURL}/api.php`,
			}).page(pageName);

			return page;
		} catch (error) {
			console.log(error, " na GetPage");
		}
	}
}
