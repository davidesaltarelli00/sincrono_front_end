FROM node:latest
USER root
RUN npm install -g @angular/cli
RUN apt update
RUN apt install nginx -y
#FROM nginx:latest AS ng
#COPY --from=build /var/jenkins_home/workspace/sincronofe_master/dist/sincrono /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf
EXPOSE 80
