pipeline {
    agent none
    stages {
        stage('Build and Deploy') {
            agent {dockerfile { filename 'Dockerfile' }}
            steps {
                sh 'docker run -v /home/sviluppo/nginx/server1:/home/sviluppo/nginx/server1'
                sh 'node --version'
                sh 'ng build --base-href=/home/sviluppo/nginx/server1'
            }
        }
    }
}


