import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "stanton",
  password: "password",
  port: 5432,
});
