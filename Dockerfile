FROM node:latest
USER root
RUN npm install -g @angular/cli
VOLUME ["/home/sviluppo/nginx/server1", "/opt/app/config/home/sviluppo/nginx/server2"]
