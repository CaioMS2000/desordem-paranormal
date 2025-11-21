import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import * as schemas from "@/database/schemas";

export const db = drizzle(process.env.DB_FILE_NAME!, {schema: schemas})