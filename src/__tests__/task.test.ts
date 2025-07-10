import request from "supertest";
import app from "../app";

let taskId: number;
let userId: number;

beforeAll(async () => {
  const res = await request(app).post("/users").send({ name: "TarefaUser", email: "tarefa@example.com" });
  userId = res.body.id;
});

describe("Task API Endpoints", () => {
  it("deve criar uma tarefa", async () => {
    const res = await request(app).post("/tasks").send({
      titulo: "Tarefa 1",
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

  it("deve deletar a tarefa", async () => {
    const res = await request(app).delete(`/tasks/${taskId}`);
    expect(res.statusCode).toBe(204);
  });

  it("deve falhar ao atualizar tarefa inexistente", async () => {
    const res = await request(app).put(`/tasks/9999`).send({
      titulo: "Inexistente",
      descricao: "Desc",
      concluido: false,
    });
    expect(res.statusCode).toBe(404);
  });

  it("deve falhar ao deletar tarefa inexistente", async () => {
    const res = await request(app).delete(`/tasks/9999`);
    expect(res.statusCode).toBe(404);
  });
});
