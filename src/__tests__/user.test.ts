import request from "supertest";
import  app  from "../app";
import { pool } from "../db";

let userId1: number;
let userId2: number;

beforeAll(async () => {
  await pool.query("DELETE FROM users");
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

  it("deve listar usuários após criação", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  it("deve atualizar usuário", async () => {
    const update = await request(app).put(`/users/${userId1}`).send({ name: "Updated", email: "update@example.com" });
    expect(update.statusCode).toBe(200);
    expect(update.body.name).toBe("Updated");
  });

  it("deve falhar ao atualizar com email duplicado", async () => {
    const res = await request(app).put(`/users/${userId2}`).send({ name: "B", email: "update@example.com" });
    expect(res.statusCode).toBe(409);
  });

  it("deve deletar usuário", async () => {
    const user = await request(app).post("/users").send({ name: "ToDelete", email: "todelete@example.com" });
    const res = await request(app).delete(`/users/${user.body.id}`);
    expect(res.statusCode).toBe(204);
  });

  it("deve permitir recriação após exclusão", async () => {
    const create = await request(app).post("/users").send({ name: "Again", email: "again@example.com" });
    const id = create.body.id;
    await request(app).delete(`/users/${id}`);
    const recreate = await request(app).post("/users").send({ name: "Again", email: "again@example.com" });
    expect(recreate.statusCode).toBe(200);
  });
});
