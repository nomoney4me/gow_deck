const express = require('express')
      , app = express()
      , bodyParser = require('body-parser')
      , fetch = require('node-fetch')

const apiRoutes = require('./api/routes')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.set('view engine', 'pug')
app.use(express.static(__dirname+'/views'))

app.get('/:NameCode', (req, res) => {
  fetch('http://localhost:3000/api/GetUserProfile', {
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      NameCode: req.params.NameCode
    })
  })
  .then(res => res.json())
  .then(data => {
    res.render('index', {data: data})
  })
  
})

app.use('/api', apiRoutes)

app.listen(3000, console.log('listening on 3000'))
