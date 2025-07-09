FROM node:18

WORKDIR /app

# Copia só o necessário para instalar dependências
COPY package*.json ./
RUN npm install

# Copia o restante do projeto
COPY . .

# Compila o código TypeScript
RUN npm run build

# Inicia a aplicação
CMD ["npm", "start"]
