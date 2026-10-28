import { mkdir, mkdtemp, readdir, rm, stat, unlink, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const timestamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')
const backupDir = path.resolve(process.env.BACKUP_DIR || path.join(process.env.DATA_DIR || './data', 'backups'))
const keep = Math.max(1, Number(process.env.BACKUP_KEEP || 14))

await mkdir(backupDir, { recursive: true, mode: 0o700 })

let outputName
if (process.env.MONGODB_URI) {
  outputName = `myr-${timestamp}.archive.gz`
  const outputPath = path.join(backupDir, outputName)
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'myr-mongodump-'))
  const configPath = path.join(tempDir, 'mongodump.yaml')
  try {
    await writeFile(configPath, `uri: ${JSON.stringify(process.env.MONGODB_URI)}\n`, { mode: 0o600 })
    await run('mongodump', ['--config', configPath, `--archive=${outputPath}`, '--gzip'])
  } finally {
    await rm(tempDir, { recursive: true, force: true })
  }
} else if (process.env.DATABASE_URL) {
  outputName = `myr-${timestamp}.dump`
  const outputPath = path.join(backupDir, outputName)
  const childEnv = { ...process.env, PGDATABASE: process.env.DATABASE_URL }
  delete childEnv.DATABASE_URL
  await run('pg_dump', ['--format=custom', '--no-owner', '--no-privileges', '--file', outputPath], childEnv)
} else {
  const dataDir = path.resolve(process.env.DATA_DIR || './data')
  const dbPath = path.join(dataDir, 'myr.sqlite')
  outputName = `myr-${timestamp}.sqlite`
  const outputPath = path.join(backupDir, outputName)
  const database = new DatabaseSync(dbPath)
  try {
    // VACUUM INTO produces a consistent SQLite snapshot, including committed WAL data.
    database.exec(`VACUUM INTO '${outputPath.replaceAll("'", "''")}'`)
  } finally {
    database.close()
  }
}

const backups = (await readdir(backupDir))
  .filter((name) => /^myr-\d{4}-\d{2}-\d{2}T.*\.(?:dump|sqlite|archive\.gz)$/.test(name))
  .map(async (name) => ({ name, modified: (await stat(path.join(backupDir, name))).mtimeMs }))
const newestFirst = (await Promise.all(backups)).sort((a, b) => b.modified - a.modified)
await Promise.all(newestFirst.slice(keep).map(({ name }) => unlink(path.join(backupDir, name))))
console.log(`Created database backup: ${path.join(backupDir, outputName)}`)

function run(command, args, env = process.env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { env, stdio: ['ignore', 'ignore', 'inherit'] })
    child.once('error', reject)
    child.once('exit', (code) => code === 0 ? resolve() : reject(new Error(`${command} exited with status ${code}`)))
  })
}
