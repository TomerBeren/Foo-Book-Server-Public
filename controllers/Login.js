import loginModel from '../models/Login.js'

async function login(req, res) {

    const result = await loginModel.checkUsernameAndPassword(req.body.username, req.body.password)
    if (result) {
        console.log(result)
        req.session.username = req.body.username
        res.json({ result: 'Success' })
    }
    else {
        console.log(result)
        res.json({ result: 'Failure', reason: 'Invalid username or password' })
    }

}

function isLoggedIn(req, res, next) {
    if (req.session.username != null) {
        return next()
    }
    else {
        res.redirect('/')
    }
}

export default { login, isLoggedIn };