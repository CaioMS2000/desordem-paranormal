import { PageRepository } from "@/repository/page-repository";
import { WikiService } from "./wiki-service";
import { BuildRepository } from "@/repository/build-repository";
import { EventEmitter } from "node:events";

export class BuildService extends EventEmitter {
    constructor(
            private wikiService: WikiService,
            private pageRepository: PageRepository,
            private buildRepository: BuildRepository,
        ){
            super();
        }
    
        async storeAllPages(buildId: string){
            const pageNames = await this.wikiService.getAllPageNames()
    
            await Promise.all(pageNames.map(async name => {
                const page = await this.wikiService.getPage(name)
    
                if(page){
                    const html = await page.html()
                    const rawInfo = await page.rawInfo()
                    const links = await page.links()
                    const url = await page.url()
                    
                    await this.pageRepository.upsertPage({
                        html,
                        links,
                        raw: rawInfo,
                        title: page.title,
                        url: url,
                        wikiId: page.pageid,
                        buildId
                    })
                }
            }))
        }

	async build() {
		const { buildId } = await this.buildRepository.startNewBuild();
		console.log(`🔄 Starting build ${buildId}`);

		try {
			let pagesCount = 0;
			let connectionsCount = 0;

			await this.storeAllPages(buildId);

            const allPages = await this.pageRepository.getAllPages();
            pagesCount = allPages.length;

            await Promise.all(allPages.map(async (p) => {
                await Promise.all(p.links.map(async (link) => {
                    const targetPage = await this.pageRepository.getPageByLink(link, buildId);

                    if(targetPage){
                        await this.pageRepository.createConnection(p.id, targetPage.id, buildId);
                        connectionsCount++;
                    }
                }))
            }))

			await this.buildRepository.completeBuild(buildId, { pagesCount, connectionsCount });
			console.log(
				`✅ Build completed: ${pagesCount} pages, ${connectionsCount} connections`,
			);

			// Emite evento de conclusão
			this.emit('buildCompleted', { buildId, pagesCount, connectionsCount });

		} catch (error) {
            if(error instanceof Error){
                await this.buildRepository.failBuild(buildId, error.message);
                console.error(`❌ Build failed: ${error.message}`)
                this.emit('buildFailed', { buildId, error });
            }
            else{
                await this.buildRepository.failBuild(buildId, 'Unknown error');
                console.error('❌ Build failed:\n', error);
                this.emit('buildFailed', { buildId, error });
            }
		}
	}

    async clearOldBuilds(keepLast: number = 3){
        return this.buildRepository.cleanupOldBuilds(keepLast)
    }
}
