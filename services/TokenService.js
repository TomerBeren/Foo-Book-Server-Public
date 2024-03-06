import jwt from 'jsonwebtoken'
const secretKey = "We are going to get an A+"

const createToken = (userId) => {
    const payload = { id: userId.toString() };
    const token = jwt.sign(payload, secretKey)
    return token;

}
const verifyJwt = (token) => {
    const data = jwt.verify(token, secretKey)
    return data;
}
export default { createToken, verifyJwt }