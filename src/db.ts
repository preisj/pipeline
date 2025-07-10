import { Pool } from "pg";
import dotenv from "dotenv";

// Carrega o .env correspondente ao ambiente
dotenv.config({ path: `.env.${process.env.NODE_ENV || "dev"}` });

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
    // Remova o process.exit(1) para não matar os testes
    // process.exit(1);
  });

