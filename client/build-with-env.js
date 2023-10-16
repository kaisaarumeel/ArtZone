require('dotenv').config({ path: '../.env' })
const childProcess = require('child_process')
childProcess.execSync('vue-cli-service build', { stdio: 'inherit' })
