FROM node:latest
USER root
RUN npm install -g @angular/cli
VOLUME ["/home/sviluppo/nginx/server1", "/home/sviluppo/nginx/server2"]
RUN --mount=target=/home/sviluppo/nginx/server1,type=bind,source=/home/sviluppo/nginx/server1
