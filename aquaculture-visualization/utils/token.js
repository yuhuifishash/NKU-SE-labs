const jwt = require('jsonwebtoken')
const secretKey = require('../config/token_secret')
var tokenhandler = {}

tokenhandler.generate = (payload) => {
    const token = 'Bearer ' +
        jwt.sign(payload, secretKey, {
            expiresIn: '1h',
        });

    return token;
}

tokenhandler.verify = (req,res,next) => {
    if(req.headers.authorization == undefined) {
        return res.json({ status: 223, msg: "token无效" });
    }
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, secretKey, function (err, decoded) {
        if (err) {
            return res.json({ status: 223, msg: "token无效" });
        }
        console.log('token verify success')
        next();
    })
}

tokenhandler.DataAdminVerify = (req,res,next) => {
    if(req.headers.authorization == undefined) {
        return res.json({ status: 224, msg: "没有数据管理员权限" });
    }
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, secretKey, function (err, decoded) {
        if (err || decoded.level < 1) { // need update
            return res.json({ status: 224, msg: "没有数据管理员权限" });
        }
        console.log('data verify success')
        next();
    })
}

tokenhandler.UserAdminVerify = (req,res,next) => {
    if(req.headers.authorization == undefined) {
        return res.json({ status: 225, msg: "没有用户管理员权限" });
    }
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, secretKey, function (err, decoded) {
        if (err || decoded.level < 2) { // need update
            return res.json({ status: 225, msg: "没有用户管理员权限" });
        }
        console.log('user verify success')
        next();
    })
}

tokenhandler.parse = (req,res,next) => {
    if(req.headers.authorization == undefined) {
        return res.json({ status: 223, msg: "token无效" });
    }
    
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, secretKey, function (err, decoded) {
        if (err) {
            return res.json({ status: 223, msg: "token无效" });
        }
        console.log('token parse success')
        return res.json({username: decoded.username,level: decoded.level,email: decoded.email})
    })
}

module.exports = tokenhandler