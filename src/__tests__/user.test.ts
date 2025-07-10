import request from "supertest";
import app from "../app";
import { pool } from "../db";

let userId1: number;
let userId2: number;

beforeAll(async () => {
  await pool.connect();
});

beforeEach(async () => {
  await pool.query("DELETE FROM users"); // limpa antes de cada teste
});

afterAll(async () => {
  await pool.end();
});

describe("User API Endpoints", () => {
  it("deve criar um usuário válido", async () => {
    const res = await request(app).post("/users").send({ name: "Alice", email: "alice@example.com" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    userId1 = res.body.id;
  });

  it("deve criar um segundo usuário", async () => {
    const res = await request(app).post("/users").send({ name: "Bob", email: "bob@example.com" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    userId2 = res.body.id;
  });

  it("deve falhar ao criar com email duplicado", async () => {
    await request(app).post("/users").send({ name: "Primeiro", email: "alice@example.com" });
    const res = await request(app).post("/users").send({ name: "Duplicado", email: "alice@example.com" });
    expect(res.statusCode).toBe(409);
  });

  it("deve retornar lista vazia se não houver usuários", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  });

  it("deve listar usuários após criação", async () => {
    await request(app).post("/users").send({ name: "Charlie", email: "charlie@example.com" });
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  it("deve atualizar usuário", async () => {
    const create = await request(app).post("/users").send({ name: "Update", email: "update@example.com" });
    const id = create.body.id;
    const update = await request(app).put(`/users/${id}`).send({ name: "Updated", email: "update@example.com" });
    expect(update.statusCode).toBe(200);
    expect(update.body.name).toBe("Updated");
  });

  it("deve falhar ao atualizar com email duplicado", async () => {
    const u1 = await request(app).post("/users").send({ name: "A", email: "a@example.com" });
    const u2 = await request(app).post("/users").send({ name: "B", email: "b@example.com" });
    const res = await request(app).put(`/users/${u2.body.id}`).send({ name: "B", email: "a@example.com" });
    expect(res.statusCode).toBe(409);
  });

  it("deve deletar usuário", async () => {
    const user = await request(app).post("/users").send({ name: "ToDelete", email: "todelete@example.com" });
    const res = await request(app).delete(`/users/${user.body.id}`);
    expect(res.statusCode).toBe(204);
  });

  it("deve falhar ao deletar inexistente", async () => {
    const res = await request(app).delete("/users/9999");
    expect(res.statusCode).toBe(404);
  });

  it("deve permitir recriação após exclusão", async () => {
    const create = await request(app).post("/users").send({ name: "Again", email: "again@example.com" });
    const id = create.body.id;
    await request(app).delete(`/users/${id}`);
    const recreate = await request(app).post("/users").send({ name: "Again", email: "again@example.com" });
    expect(recreate.statusCode).toBe(200);
  });
});

