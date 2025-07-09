import { Request, Response } from "express";
import { pool } from "../db";

// Helper para validar dados
function validateUser(name?: string, email?: string) {
  if (!name || !email) return false;
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
}

export const getUsers = async (_: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  if (!validateUser(name, email)) return res.status(400).json({ error: "Invalid input" });

  const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (existing.rows.length > 0) return res.status(409).json({ error: "Email already exists" });

  const result = await pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]
  );
  res.json(result.rows[0]);
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;
  if (!validateUser(name, email)) return res.status(400).json({ error: "Invalid input" });

  const duplicate = await pool.query("SELECT * FROM users WHERE email = $1 AND id != $2", [email, id]);
  if (duplicate.rows.length > 0) return res.status(409).json({ error: "Email already in use" });

  const result = await pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
    [name, email, id]
  );
  if (result.rowCount === 0) return res.status(404).json({ error: "User not found" });

  res.json(result.rows[0]);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
  if (result.rowCount === 0) return res.status(404).json({ error: "User not found" });
  res.sendStatus(204);
};
