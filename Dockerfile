FROM jenkins/jenkins:2.414.1-jdk17
USER root
RUN npm install -g @angular/cli
