const express = require('express')
const app = express()

app.use(express.static('public'))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/login', function (req, res) {
    var user = req.body.username
    var pass = req.body.password

    if ((user == 'Tomer') & (pass == 'a5k8b123')) {
        res.json({ result: 'Success' })
    }
    else {
        res.json({ result: 'Failure', reason: 'Invalid username or password' })
    }
})

app.listen(8080)