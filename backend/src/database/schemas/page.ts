import { randomUUID } from "crypto";
import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { build } from "./build-history";

export const page = sqliteTable(
	"page",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => randomUUID()),
		wikiId: int("wiki_id").notNull(),
		title: text("title").notNull(),
		links: text("links", { mode: "json" }).$type<string[]>().notNull(),
		url: text("url").notNull(),
		html: text("html").notNull(),
		raw: text("html").notNull(),
		buildId: text("build_id")
			.notNull()
			.references(() => build.id),
	},
	(table) => [index("wiki_id_idx").on(table.wikiId)],
);

export type WikiPage = typeof page.$inferSelect;
export type InsertWikiPage = typeof page.$inferInsert;
