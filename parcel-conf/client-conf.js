const Bundler = require('parcel-bundler')
const { resolve } = require('path')
const fs = require('fs-extra')
const childProcess = require('child_process')

const entryFiles = resolve(__dirname, '..', 'src', 'client', 'index.html')
const assetsPath = resolve(__dirname, '..', 'src', 'client', 'assets')

const options = {
  outDir: './build/client',
  outFile: 'index.html',
  publicUrl: './',
  cacheDir: '.cache',
  logLevel: 3,
  target: 'browser',
  assetsPath
}

async function main () {
  const bundler = new Bundler(entryFiles, options)

  const outDir = bundler.options.outDir

  fs.remove(outDir, err => {
    console.error(err)
  })

  let exec = false
  childProcess.spawnSync('npm', ['run', 'standard'], { stdio: 'inherit' })

  bundler.on('bundled', (bundle) => {
    fs.copy(assetsPath, `${outDir}/assets`, function (err) {
      if (err) {
        console.log('An error occured while copying the folder.')
        return console.error(err)
      }
      console.log('Copy completed!')
    })
  })

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
