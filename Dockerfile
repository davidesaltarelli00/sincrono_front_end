FROM jenkins/jenkins:2.414.1-jdk17
USER root
RUN apt-get update && apt-get install -y lsb-release
