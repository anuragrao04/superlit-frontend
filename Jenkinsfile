pipeline {
    agent any

    stages {
        stage('Build') {
        steps {
                sh '''
                export NVM_DIR="/home/pesurf/.nvm"
                [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
                nvm use 22
                node -v
                npm install
                npm run build
                '''
        }
        }
        stage('Test') {
            steps {
                echo 'In Terms of testing, we have no testing..'
            }
        }
        stage('Deploy') {
            steps {
              echo 'Deploying....'
              sh 'rm -rf /var/www/html/*'
              sh 'cp -r dist/* /var/www/html/'
            }
        }
    }
}
