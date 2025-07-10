import request from "supertest";
import { app } from "../app";
import { pool } from "../db";

let userId: number;
let taskId: number;

beforeAll(async () => {
  await pool.query("DELETE FROM tarefas");
  await pool.query("DELETE FROM users");

  const res = await request(app).post("/users").send({ name: "Tester", email: "tester@example.com" });
  userId = res.body.id;
});

afterAll(async () => {
  await pool.end();
});

describe("Task API Endpoints", () => {
  it("deve criar uma tarefa", async () => {
    const res = await request(app).post("/tasks").send({
      titulo: "Nova Tarefa",
      descricao: "Descrição da tarefa",
      user_id: userId,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    taskId = res.body.id;
  });

  it("deve listar tarefas", async () => {
    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("deve atualizar a tarefa", async () => {
    const res = await request(app).put(`/tasks/${taskId}`).send({
      titulo: "Tarefa Atualizada",
      descricao: "Atualizada",
      concluido: true,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.titulo).toBe("Tarefa Atualizada");
  });

  it("deve falhar ao atualizar tarefa com ID inválido", async () => {
    const res = await request(app).put(`/tasks/abc`).send({
      titulo: "Invalida",
      descricao: "Erro",
      concluido: false,
    });
    expect(res.statusCode).toBe(400);
  });

  it("deve falhar ao criar tarefa sem título", async () => {
    const res = await request(app).post("/tasks").send({
      descricao: "Sem título",
      user_id: userId,
    });
    expect(res.statusCode).toBe(400);
  });

  it("deve falhar ao criar tarefa sem user_id", async () => {
    const res = await request(app).post("/tasks").send({
      titulo: "Sem usuário",
      descricao: "Erro",
    });
    expect(res.statusCode).toBe(400);
  });

  it("deve deletar a tarefa", async () => {
    const res = await request(app).delete(`/tasks/${taskId}`);
    expect(res.statusCode).toBe(204);
  });

  it("deve retornar erro ao deletar tarefa inexistente", async () => {
    const res = await request(app).delete(`/tasks/${taskId}`);
    expect(res.statusCode).toBe(404);
  });

  it("deve criar múltiplas tarefas válidas", async () => {
    for (let i = 1; i <= 3; i++) {
      const res = await request(app).post("/tasks").send({
        titulo: `Tarefa ${i}`,
        descricao: `Desc ${i}`,
        user_id: userId,
      });
      expect(res.statusCode).toBe(200);
    }
  });

  it("deve listar todas as tarefas criadas", async () => {
    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(3);
  });
});
