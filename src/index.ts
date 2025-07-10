import app from "./app";

const port = process.env.PORT || 3000;

// Só escuta a porta se **não** estiver rodando testes
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
  });
}



