require('dotenv').config()

const authenticateToken = (req, res, next) =>  {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) {console.log('stopped at token') 
    return res.sendStatus(401)}

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log('stopped after token')
            return res.sendStatus(403)}

        req.user = user
        next()
    })
}

module.exports = authenticateToken;