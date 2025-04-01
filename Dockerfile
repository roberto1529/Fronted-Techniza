# Usa la última versión LTS de Node.js para construir la app
FROM node:lts AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto
COPY . .

# Instala las dependencias
RUN npm install

# Compila el proyecto en modo producción
RUN npm run build --prod

# Usa una imagen de Nginx para servir la aplicación
FROM nginx:latest

# Copia el build de Angular a la carpeta de Nginx
COPY --from=build /app/dist/sakai-ng/browser /usr/share/nginx/html

# Copia la configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expone el puerto 80
EXPOSE 80 443

# Inicia Nginx
CMD ["nginx", "-g", "daemon off;"]
