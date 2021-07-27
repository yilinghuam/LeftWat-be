const jwt = require('jsonwebtoken')

module.exports = {

    authenticatedOnly: (req, res, next) => {
        //check if token exists
        const token = req.cookies.access_token
        console.log(token)
        if(!token) {
            res.statusCode = 403 //forbidden
            return res.json()

        }

        //verify token
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET)
            req.email = data.email
            console.log(data)
            console.log(req.email)
            return next()
        } catch {
            res.statusCode = 403 //forbidden
            return res.json()
        }
    }

}