import { Router } from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "./controllers/userController";

import { createTask, getTasks, updateTask, deleteTask } from "./controllers/taskController";

const router = Router();

// Healthcheck
router.get("/health", (_, res) => res.json({ status: "ok" }));

// Usuários (com validação e tratamento de erro)
router.get("/users", getUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.post("/tasks", createTask);
router.get("/tasks", getTasks);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);


export default router;
