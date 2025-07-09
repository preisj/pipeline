import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT),
});

pool.connect()
  .then(() => console.log("🎉 Conectado ao banco de dados"))
  .catch((err) => {
    console.error("❌ Erro ao conectar no banco:", err);
    process.exit(1);
  });
