import { spawn } from 'node:child_process'

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const apiPort = Number(process.env.PORT || 3001)
const apiHealthUrl = `http://localhost:${apiPort}/api/health`
let apiAlreadyRunning = false
try {
  const response = await fetch(apiHealthUrl, { signal: AbortSignal.timeout(1200) })
  apiAlreadyRunning = response.ok
} catch {
  // No healthy API is responding; start the local API below.
}

let shuttingDown = false
const children = []
if (apiAlreadyRunning) console.log(`Using existing API server on :${apiPort}.`)
else children.push(spawn(npm, ['run', 'dev:api'], { stdio: 'inherit', env: process.env }))
children.push(spawn(npm, ['run', 'dev:web'], { stdio: 'inherit', env: process.env }))

function shutdown(signal = 'SIGTERM') {
  if (shuttingDown) return
  shuttingDown = true
  for (const child of children) if (!child.killed) child.kill(signal)
}

for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => shutdown(signal))
for (const child of children) {
  child.on('error', (error) => {
    console.error('Could not start the development server:', error.message)
    shutdown()
  })
  child.on('exit', (code) => {
    if (!shuttingDown) {
      if (code) console.error(`A development server exited with code ${code}.`)
      shutdown()
    }
  })
}
