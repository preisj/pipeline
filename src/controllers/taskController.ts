import { Request, Response } from "express";
import { pool } from "../db";

// Criar tarefa
export const createTask = async (req: Request, res: Response) => {
  const { titulo, descricao, user_id } = req.body;
  if (!titulo || !user_id) return res.status(400).json({ error: "Título e user_id são obrigatórios" });
  try {
    const result = await pool.query(
      "INSERT INTO tarefas (titulo, descricao, user_id) VALUES ($1, $2, $3) RETURNING *",
      [titulo, descricao, user_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar tarefa" });
  }
};

// Listar tarefas
export const getTasks = async (_: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM tarefas");
  res.json(result.rows);
};

// Atualizar tarefa
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { titulo, descricao, concluido } = req.body;
  const result = await pool.query(
    "UPDATE tarefas SET titulo = $1, descricao = $2, concluido = $3 WHERE id = $4 RETURNING *",
    [titulo, descricao, concluido, id]
  );
  if (result.rowCount === 0) return res.status(404).json({ error: "Tarefa não encontrada" });
  res.json(result.rows[0]);
};

// Deletar tarefa
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await pool.query("DELETE FROM tarefas WHERE id = $1", [id]);
  if (result.rowCount === 0) return res.status(404).json({ error: "Tarefa não encontrada" });
  res.sendStatus(204);
};
