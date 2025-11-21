import { BuildRepository } from "@/repository/build-repository";
import { db } from "@/lib/drizzle";
import { and, eq, not } from "drizzle-orm";
import { build, connection } from "@/database/schemas";

export class SQLiteBuildRepository extends BuildRepository {
    async startNewBuild(): Promise<{ buildId: string; buildTimestamp: Date; }> {
        const buildTimestamp = new Date();
        const [newBuild] = await db.insert(build).values({
            buildTimestamp,
            status: 'building'
        }).returning();

        if (!newBuild) {
            throw new Error('Failed to create build');
        }

        return { buildId: newBuild.id, buildTimestamp: newBuild.buildTimestamp };
    }

    async completeBuild(buildId: string, stats: { pagesCount: number; connectionsCount: number; }): Promise<void> {
        // Marca como ativa
        await db.update(build)
            .set({
                status: 'active',
                completedAt: new Date(),
                pagesProcessed: stats.pagesCount,
                connectionsCreated: stats.connectionsCount
            })
            .where(eq(build.id, buildId));

        // Arquiva builds antigas
        await db.update(build)
            .set({ status: 'archived' })
            .where(and(
                eq(build.status, 'active'),
                not(eq(build.id, buildId))
            ));
    }

    async failBuild(buildId: string, errorMessage: string): Promise<void> {
        await db.update(build)
            .set({
                errorMessage,
                completedAt: new Date()
            })
            .where(eq(build.id, buildId));
    }

    async getActiveBuildTimestamp(): Promise<Date> {
        const activeBuild = await db.query.build.findFirst({
            where: (table, { eq }) => eq(table.status, 'active'),
            orderBy: (table, { desc }) => [desc(table.buildTimestamp)]
        });

        if (!activeBuild) {
            throw new Error('No active build found');
        }

        return activeBuild.buildTimestamp;
    }

    async cleanupOldBuilds(keepLast: number = 3): Promise<void> {
        const builds = await db.query.build.findMany({
            where: (table, { eq }) => eq(table.status, 'archived'),
            orderBy: (table, { desc }) => [desc(table.buildTimestamp)],
            limit: 100
        });

        const buildsToDelete = builds.slice(keepLast);

        for (const b of buildsToDelete) {
            // Deleta conexões antigas
            await db.delete(connection).where(eq(connection.buildId, b.id));

            // Deleta histórico
            await db.delete(build).where(eq(build.id, b.id));
        }
    }
}