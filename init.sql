CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);

CREATE TABLE tarefas (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  concluido BOOLEAN DEFAULT FALSE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (name, email) VALUES
('Usuário A', 'a@example.com'),
('Usuário B', 'b@example.com');

INSERT INTO tarefas (titulo, descricao, concluido, user_id) VALUES
('Tarefa 1', 'Descrição 1', false, 1),
('Tarefa 2', 'Descrição 2', true, 1),
('Tarefa 3', 'Descrição 3', false, 2);
