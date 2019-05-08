const Bundler = require('parcel-bundler')
const { resolve } = require('path')
const fs = require('fs-extra')
const childProcess = require('child_process')

const entryFiles = resolve(__dirname, '..', 'src', 'server', 'index.js')

const options = {
  outDir: './build/server',
  outFile: 'index.js',
  publicUrl: './',
  cacheDir: '.cache',
  logLevel: 3,
  target: 'node'
}

async function main () {
  const bundler = new Bundler(entryFiles, options)

  const outDir = bundler.options.outDir

  fs.remove(outDir, err => {
    console.error(err)
  })

  let exec = false
  childProcess.spawnSync('npm', ['run', 'standard'], { stdio: 'inherit' })

  bundler.on('bundled', (bundle) => {})

  bundler.on('buildStart', entryPoints => {
    if (exec) {
      childProcess.spawnSync('npm', ['run', 'standard'], { stdio: 'inherit' })
    }
    exec = true
  })

  bundler.on('buildEnd', () => {})

  bundler.on('buildError', error => console.error(error))

  await bundler.bundle()
}

(async () => {
  await main()
})()
