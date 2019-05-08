import express from 'express'

const app = express()

app.get('/', (req, res) => {
  import('server/sum').then(r => {
    console.log(r.default)
    res.send('<h3>Nada Vai</h3>')
  })
})

app.listen(3000, () => console.log('Rodando na 3000'))

// parcel-plugin-clean-dist
