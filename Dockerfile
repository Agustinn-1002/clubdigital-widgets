# Usamos una imagen ligera de Nginx
FROM nginx:alpine

# Eliminamos el contenido por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiamos la carpeta /dist generada por Vite al directorio público de Nginx
COPY ./dist /usr/share/nginx/html

# Sobrescribimos la configuración por defecto con la nuestra (con CORS)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80 del contenedor
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]