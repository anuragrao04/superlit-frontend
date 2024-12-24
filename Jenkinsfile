pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                npm i
                npm run build
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
              rm -rf /var/www/html/*
              cp -r dist/* /var/www/html/
            }
        }
    }
}
