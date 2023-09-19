pipeline {
    agent none
    stages {
        stage('Build') {
            agent {dockerfile { filename 'Dockerfile' }}
            steps {
                sh 'node --version'
                sh 'ng build --base-href=/usr/share/nginx/html'
                sh 'pwd && ls dist'
                sh 'dpkg -L nginx'
            }
        }
    }
}


