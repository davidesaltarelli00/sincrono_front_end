FROM node:latest
USER root
RUN npm install
RUN npm install -g @angular/cli 
