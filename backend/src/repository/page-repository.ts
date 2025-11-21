import { InsertWikiPage, WikiPage } from "@/database/schemas";

// Pode definir com 'interface' ao invés de 'abstract class' se preferir
export abstract class PageRepository {
    abstract getAllPages(): Promise<WikiPage[]>
    abstract upsertPage(data: InsertWikiPage): Promise<WikiPage>

    abstract getPage(id: string): Promise<WikiPage | undefined>
    abstract getPage(id: string, config:{required: true}): Promise<WikiPage>
    abstract getPage(id: string, config?:{required: boolean}): Promise<WikiPage | undefined>

    abstract getPageByLink(link: string, buildId: string): Promise<WikiPage | undefined>
    abstract getPageByLink(link: string, buildId: string, config:{required: true}): Promise<WikiPage>
    abstract getPageByLink(link: string, buildId: string, config?:{required: boolean}): Promise<WikiPage | undefined>

    abstract createConnection(originId: string, targetId: string, buildId: string): Promise<void>
    abstract getConnections(id: string): Promise<WikiPage[]>
    abstract removeConnections(id: string, buildId: string): Promise<void>
}