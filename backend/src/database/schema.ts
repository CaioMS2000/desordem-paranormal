// import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

// export const page = sqliteTable("page", {
//   id: int()
//     .primaryKey()
//     .references(() => connections.originPage, {
//       onDelete: "cascade",
//     }),
//   name: text().notNull(),
//   link: text().notNull(),
//   html: text().notNull(),
// });

// export const connections = sqliteTable("connections", {
//   id: int().primaryKey({ autoIncrement: true }),
//   originPage: int()
//     .notNull()
//     .references(() => page.id),
//   targetPage: int()
//     .notNull()
//     .references(() => page.id),
// });
