import { Router } from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "./controllers/userController";

const router = Router();

// Healthcheck
router.get("/health", (_, res) => res.json({ status: "ok" }));

// Usuários (com validação e tratamento de erro)
router.get("/users", getUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
