# Multi-stage build para otimizar o tamanho da imagem
FROM node:18-alpine AS builder

# Instalar dependências necessárias para o build
RUN apk add --no-cache python3 make g++

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências (reprodutível)
RUN npm install

# Copiar código fonte
COPY . .

# Build da aplicação (preferir produção, com fallback)
RUN npm run build:dev

# Stage de produção com nginx
FROM nginx:alpine

# Copiar arquivos buildados para o nginx
COPY --from=builder /app/dist/*/browser /usr/share/nginx/html

# Expor porta 80
EXPOSE 80

# Comando para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]
