pipeline {
    agent none
    stages {
        stage('Build and Deploy') {
            agent { dockerfile { 
                      filename 'Dockerfile'
                      args '-u 0 -v /var/jenkins_home/server1:/var/jenkins_home/server1 -v /var/jenkins_home/server2:/var/jenkins_home/server2'
                               }
                  }
            steps {
                sh 'node --version'
                sh 'npm i -D @angular-devkit/build-angular'
                sh 'ng build'
                sh 'rm -fr /var/jenkins_home/server1/*'
                sh 'rm -fr /var/jenkins_home/server2/*'
                sh 'cp -r /var/jenkins_home/workspace/sincronofe_master/dist/sincrono/* /var/jenkins_home/server1'
                sh 'cp -r /var/jenkins_home/workspace/sincronofe_master/dist/sincrono/* /var/jenkins_home/server2'
            }
        }
    }
}


