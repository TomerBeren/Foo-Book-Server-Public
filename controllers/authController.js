import userService from '../services/User.js'
import tokenService from '../services/Tokens.js'

async function login(req, res) {

    const user = await userService.checkUsernameAndPassword(req.body.username, req.body.password)
    if (user) {
        const token = tokenService.createToken(user._id)
        res.json({ result: 'Success', token: token, userId : user._id })
    }
    else {
        console.log(result)
        res.json({ result: 'Failure', reason: 'Invalid username or password' })
    }

}

function isLoggedIn(req, res, next) {
    // If the request has an authorization header
    if (req.headers.authorization) {
        // Extract the token from that header
        const token = req.headers.authorization.split(" ")[1];
        try {
            // Verify the token is valid
            const data = tokenService.verifyJwt(token);
            req.user = data;
            // Token validation was successful. Continue to the actual function (index)
            return next()
        } catch (err) {
            return res.status(401).json("Invalid Token");
        }
    }
    else
        return res.status(403).send('Token required');
}

export default { login, isLoggedIn };