FROM node:20-alpine AS builder

WORKDIR /app

# Copiar todo el código fuente
COPY . .

# Instalar dependencias y construir la aplicación
RUN npm install && npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos estáticos desde la etapa de construcción
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
