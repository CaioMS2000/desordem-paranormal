import { baseWikiURL } from "@/constants";
import { connection, InsertWikiPage, page, WikiPage } from "@/database/schemas";
import { db } from "@/lib/drizzle";
import { PageRepository } from "@/repository/page-repository";
import { and, eq } from "drizzle-orm";

export class SQLitePageRepository extends PageRepository{
    getAllPages(): Promise<WikiPage[]> {
        return db.query.page.findMany()
    }
    async getPage(id: string): Promise<WikiPage | undefined>
    async getPage(id: string, config:{required: true}): Promise<WikiPage>
    async getPage(id: string, config?:{required: boolean}): Promise<WikiPage | undefined> {
        const wikiPage = await db.query.page.findFirst({
            where: (table, {eq}) => eq(table.id, id)
        })

        if(config && config.required){
            if(!wikiPage){
                throw new Error(`Page with id ${id} not found`)
            }
        }

        return wikiPage
    }

    async getPageByLink(link: string, buildId: string): Promise<WikiPage | undefined>
    async getPageByLink(link: string, buildId: string, config:{required: true}): Promise<WikiPage>
    async getPageByLink(link: string, buildId: string, config?:{required: boolean}): Promise<WikiPage | undefined> {
        const wikiPage = await db.query.page.findFirst({
            where: (table, {eq, and}) => and(eq(table.url, `${baseWikiURL}${link}`), eq(table.buildId, buildId))
        })

        if(config && config.required){
            if(!wikiPage){
                throw new Error(`Page with link ${link} not found`)
            }
        }

        return wikiPage
    }

    async upsertPage(data: InsertWikiPage): Promise<WikiPage> {
        const [newPage] = await db.insert(page).values(data).onConflictDoUpdate({target: page.wikiId, set: data}).returning()

        if(!newPage){
            throw new Error('Failed to insert page')
        }

        return newPage
    }

    createConnection(originId: string, targetId: string, buildId: string): Promise<void> {
        return db.insert(connection).values({origin: originId, target: targetId, buildId})
    }

    async getConnections(id: string): Promise<WikiPage[]> {
        const connectedPages = await db.query.connection.findMany({where: (table, {eq}) => eq(table.origin, id),})

        return Promise.all(connectedPages.map(async conn => this.getPage(conn.target, {required: true})))
    }

    removeConnections(id: string, buildId: string): Promise<void> {
        return db.delete(connection).where(and(eq(connection.origin, id), eq(connection.buildId, buildId)))
    }
}