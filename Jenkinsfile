pipeline {
    agent none
    stages {
        stage('Build and Deploy') {
            agent {dockerfile { filename 'Dockerfile' }}
            steps {
                sh 'node --version'
                sh 'ng build --base-href=/home/sviluppo/nginx/server1'
            }
        }
    }
}


