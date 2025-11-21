import { SQLiteBuildRepository } from "@/database/sqlite/repository/build-repository";
import { SQLitePageRepository } from "@/database/sqlite/repository/page-repository";
import { BuildJob } from "@/jobs/build-job";
import type { BuildRepository } from "@/repository/build-repository";
import type { PageRepository } from "@/repository/page-repository";
import { BuildService } from "@/services/build-service";
import { WikiService } from "@/services/wiki-service";
import { app } from "./app";
import { injectDependencies } from "./middleware/inject-resources";
import { buildRouter } from "./routes/build/router";

// Executa uma vez quando o servidor inicia, logo uma única instância de cada repositório e serviço é criada e atende todas as requisições
const buildRepository: BuildRepository = new SQLiteBuildRepository();
const pageRepository: PageRepository = new SQLitePageRepository();
const wikiService = new WikiService();
const buildService = new BuildService(
	wikiService,
	pageRepository,
	buildRepository,
);
const buildJob = new BuildJob(buildService);
const port = process.env.ENV_PORT;

// Iniciar o cron job para builds automáticos
buildJob.start();

app.use(injectDependencies({ wikiService, buildService }));

app.use("", buildRouter);

app.listen(port, () => {
	console.log(`Server running.\nPort: ${port}`);
});

async function test() {
	const pageNames = await wikiService.getAllPageNames();
	const page = await wikiService.getPage(pageNames[0] ?? "fake-page");

	if (page) {
		console.log("page");
		console.log(page);
		console.log("\n\n");

		const links = await page.links();
		console.log("\n\nlinks:\n", links);
		const categories = await page.categories();
		console.log("\n\ncategories:\n", categories);
		const info = await page.info();
		console.log("\n\ninfo:\n", info);
		const backlinks = await page.backlinks();
		console.log("\n\nbacklinks:\n", backlinks);
		const rawImages = await page.rawImages();
		console.log("\n\nrawImages:\n", rawImages);
		const mainImage = await page.mainImage();
		console.log("\n\nmainImage:\n", mainImage);
		const langlinks = await page.langlinks();
		console.log("\n\nlanglinks:\n", langlinks);
		const rawInfo = await page.rawInfo();
		console.log("\n\nrawInfo:\n", rawInfo);
		const fullInfo = await page.fullInfo();
		console.log("\n\nfullInfo:\n", fullInfo);
		const pageImage = await page.pageImage();
		console.log("\n\npageImage:\n", pageImage);
		const url = await page.url();
		console.log("\n\nurl:\n", url);
		console.log("\n\nid:\n", page.pageid);
		console.log("\n\ntitle:\n", page.title);
	}
}

test();
// Obs: sei que o sistema ainda não vai funcionar certinho por causa de que precisaria de uma funcionalidade de tornar os links "URL safe" por causa do jeito que essa lib de wiki traz os links relacionados. Quando você vê a maneira com que os dados são impressos nessa função 'test' você vai ter uma ideia.