const secureData = require('../utils/secureData')
const jwt = require('jsonwebtoken');
const lineNumber = require('../lineNumberFunction');
const logger = require('../loggingFunction');
const {UNAUTHORIZED, INVALID_ERR, WRONG_OTP, CONTACT_ERR} = require('../constants');
const usersModel = require('../models/users.model');

exports.auth = async (req, res, next) => {
    try {

        let token = req.headers['authorization']

        token = token.split(' ')[1]

        var tokens = await secureData.decrypt(token)

        const userClaims = await jwt.verify(tokens, `${process.env.ACCESS_TOKEN_SECRET}`)

        if (userClaims) {
            req.user = userClaims
            next()
        } else {
            throw(UNAUTHORIZED)
        }
        
    } catch (err) {
        logger("error", req, err, lineNumber.__line)
        return res
            .status(404)
            .send(err)
    }
}
exports.checkPhone = async (req, res, next)  => {
    try{
        if(req.params.phone) {
            const userObject = await usersModel.findOne({phone: parseInt(req.params.phone)})
            if(userObject) {
                next()
            } else {
                throw(INVALID_ERR)
            }
        } else {
            throw(CONTACT_ERR)
        }
    }catch(err) {
        logger("error", req, err, lineNumber.__line)
        return res
            .status(404)
            .send(err)
    } 
}