import { sqliteTable, text, index, integer } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";

export const build = sqliteTable("build", {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  buildTimestamp: integer('build_timestamp', { mode: 'timestamp' })
    .notNull()
    .unique(),
  status: text('status')
    .$type<'building' | 'active' | 'archived'>()
    .notNull()
    .default('building'),
  startedAt: integer('started_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  pagesProcessed: integer('pages_processed').default(0),
  connectionsCreated: integer('connections_created').default(0),
  errorMessage: text('error_message'),
}, (table) => [
  index('build_status_idx').on(table.status),
  index('build_timestamp_idx').on(table.buildTimestamp)
]);

export type Build = typeof build.$inferSelect
export type InsertBuild = typeof build.$inferInsert



