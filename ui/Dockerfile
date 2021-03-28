FROM nginx:alpine
RUN mkdir -p /app
COPY ./build /app
COPY nginx.conf /etc/nginx/
# RUN rm /app/Dockerfile /app/nginx.conf
WORKDIR /app/
CMD nginx
EXPOSE 3000