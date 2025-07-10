import { Request, Response } from "express";
import { pool } from "../db";

export const createTask = async (req: Request, res: Response) => {
  const { titulo, descricao, concluido, user_id } = req.body;
  if (!titulo || !user_id) return res.status(400).json({ error: "Título e user_id são obrigatórios" });

  try {
    const result = await pool.query(
      "INSERT INTO tarefas (titulo, descricao, concluido, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [titulo, descricao, concluido || false, user_id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar tarefa" });
  }
};

export const listTasks = async (_: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM tarefas");
  res.status(200).json(result.rows);
};

export const updateTask = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { titulo, descricao, concluido } = req.body;

  if (!id || isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  try {
    const result = await pool.query(
      "UPDATE tarefas SET titulo = $1, descricao = $2, concluido = $3 WHERE id = $4 RETURNING *",
      [titulo, descricao, concluido, id]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: "Tarefa não encontrada" });

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar tarefa" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id || isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  const result = await pool.query("DELETE FROM tarefas WHERE id = $1", [id]);

  if (result.rowCount === 0) return res.status(404).json({ error: "Tarefa não encontrada" });

  res.sendStatus(204);
};
