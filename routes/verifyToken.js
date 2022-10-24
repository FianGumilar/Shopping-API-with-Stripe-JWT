const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next) => {
    const authHeader = req.headers.token;
    const token = authHeader.split(" ")[1];
    if(authHeader) {
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if(err) res.status(403).send("Token is not valid");
            req.user = user;
            next();
        })
    } else {
        return res.status(401).send("You are not authenticated");
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        } else {
            return res.send(403).send("you don't have permission to access");
        }
    })
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.isAdmin){
            next();
        } else {
            return res.status(403).send("you don't have permission to access");
        }
    })
}

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin };