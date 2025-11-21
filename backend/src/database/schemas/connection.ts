import { randomUUID } from "crypto";
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { build } from "./build-history";
import { page } from "./page";

export const connection = sqliteTable(
	"connection",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => randomUUID()),
		origin: text("origin")
			.notNull()
			.references(() => page.id),
		target: text("target")
			.notNull()
			.references(() => page.id),
		buildId: text("build_id")
			.notNull()
			.references(() => build.id),
	},
	(table) => [
		index("connection_origin_idx").on(table.origin),
		index("connection_target_idx").on(table.target),
	],
);

export type Connection = typeof connection.$inferSelect;
export type InsertConnection = typeof connection.$inferInsert;
