import jwt from 'jsonwebtoken'
const jwtSecret = 'thisissecretkey'
export function userAuth(req, res) {
    try {
    const token = req.headers['usertoken']
    if(!token) return false;
    const decoded  = jwt.verify(token,jwtSecret)
    console.log(decoded)
    return {userId:decoded.userId} 
    } catch (error) {
    return false;
    }

}