import request from "supertest";
import app from "../index";

describe("User API Endpoints", () => {
  let userId1: number;
  let userId2: number;

  // --- Criação ---
  it("deve criar um usuário válido", async () => {
    const res = await request(app).post("/users").send({ name: "Alice", email: "alice@example.com" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    userId1 = res.body.id;
  });

  it("deve criar um segundo usuário", async () => {
    const res = await request(app).post("/users").send({ name: "Bob", email: "bob@example.com" });
    expect(res.statusCode).toBe(200);
    userId2 = res.body.id;
  });

  it("deve falhar ao criar usuário sem nome", async () => {
    const res = await request(app).post("/users").send({ email: "fail@example.com" });
    expect(res.statusCode).toBe(400);
  });

  it("deve falhar ao criar usuário sem email", async () => {
    const res = await request(app).post("/users").send({ name: "Sem Email" });
    expect(res.statusCode).toBe(400);
  });

  it("deve falhar ao criar com email duplicado", async () => {
    const res = await request(app).post("/users").send({ name: "Repetido", email: "alice@example.com" });
    expect(res.statusCode).toBe(409);
  });

  // --- Leitura ---
  it("deve listar os dois usuários criados", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  it("deve retornar vazio se não houver usuários (após exclusão)", async () => {
    await request(app).delete(`/users/${userId1}`);
    await request(app).delete(`/users/${userId2}`);
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  });

  it("deve criar novamente para testar atualização", async () => {
    const res = await request(app).post("/users").send({ name: "Charlie", email: "charlie@example.com" });
    expect(res.statusCode).toBe(200);
    userId1 = res.body.id;
  });

  // --- Atualização ---
  it("deve atualizar nome do usuário", async () => {
    const res = await request(app).put(`/users/${userId1}`).send({ name: "Charles", email: "charlie@example.com" });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Charles");
  });

  it("deve falhar ao atualizar com id inexistente", async () => {
    const res = await request(app).put(`/users/9999`).send({ name: "X", email: "x@x.com" });
    expect(res.statusCode).toBe(404);
  });

  it("deve falhar ao atualizar com dados incompletos", async () => {
    const res = await request(app).put(`/users/${userId1}`).send({ name: "Sem Email" });
    expect(res.statusCode).toBe(400);
  });

  it("deve falhar ao atualizar com email duplicado", async () => {
    await request(app).post("/users").send({ name: "Fake", email: "bob@example.com" });
    const res = await request(app).put(`/users/${userId1}`).send({ name: "X", email: "bob@example.com" });
    expect(res.statusCode).toBe(409);
  });

  // --- Deleção ---
  it("deve deletar usuário com sucesso", async () => {
    const res = await request(app).delete(`/users/${userId1}`);
    expect(res.statusCode).toBe(204);
  });

  it("deve falhar ao deletar novamente", async () => {
    const res = await request(app).delete(`/users/${userId1}`);
    expect(res.statusCode).toBe(404);
  });

  it("deve falhar ao deletar id inexistente", async () => {
    const res = await request(app).delete("/users/999999");
    expect(res.statusCode).toBe(404);
  });

  // --- Comportamento geral ---
  it("deve permitir nova criação após exclusão", async () => {
    const res = await request(app).post("/users").send({ name: "Novo", email: "novo@example.com" });
    expect(res.statusCode).toBe(200);
  });

  it("deve listar um usuário após recriação", async () => {
    const res = await request(app).get("/users");
    expect(res.body.length).toBe(1);
  });

  // --- Extras ---
  it("rota de healthcheck deve responder com ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("deve falhar ao acessar rota inexistente", async () => {
    const res = await request(app).get("/invalid-route");
    expect(res.statusCode).toBe(404);
  });
});
