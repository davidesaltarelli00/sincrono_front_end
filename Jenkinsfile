pipeline {
    agent none
    stages {
        stage('Build and Deploy') {
            agent { dockerfile { 
                      filename 'Dockerfile'
                      args '-v /home/sviluppo/nginx/server1:/home/sviluppo/nginx/server1'
                               }
                  }
            steps {
                sh 'node --version'
                sh 'ng build --base-href=/home/sviluppo/nginx/server1'
            }
        }
    }
}


