const jwt = require('jsonwebtoken')

module.exports = {

    authenticatedOnly: (req, res, next) => {
        console.log(req)
        //check if token exists
        const token = req.headers.auth_token
        if(!token) {
            return res.status(403) //forbidden

        }

        //verify token
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET)
            req.email = data.email
            return next()
        } catch {
            return res.status(403) //forbidden
        }
    }

}