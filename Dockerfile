FROM node:latest
USER root
RUN npm install -g @angular/cli

FROM nginx:latest AS ngi
COPY --from=build /dist/src/app/dist/my-docker-angular-app /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf
EXPOSE 80
