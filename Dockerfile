FROM node:latest
USER root
RUN npm install -g @angular/cli
RUN ng update @angular/cli @angular/core
#VOLUME ["/home/sviluppo/nginx/server1", "/home/sviluppo/nginx/server2"]
