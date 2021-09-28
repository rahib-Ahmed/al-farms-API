const logger = require("../loggingFunction");
const lineNumber = require('../lineNumberFunction');
const jwt = require('jsonwebtoken');
const {seqValidator, checkPassword, emailValidator, phoneValidator} = require("../validator");
const {body, param} = require("express-validator");
const secureData = require('../utils/secureData');
const usersModel = require("../models/users.model");
const {generateToken, createToken} = require("../utils/generateToken");
const {randomNumber} = require("../utils/generateNumber");
const {
    EMAIL_ERR,
    STORE_ERR,
    PASS_ERR,
    CONTACT_ERR,
    NAME_ERR,
    INVALID_ERR,
    WRONG_OTP,
    UNVERIFIED,
    NOT_EXIST
} = require("../constants");
const {sendSms} = require("../utils/sendSMS");
const {sendMail} = require("../utils/sendMail");

exports.signupUser = async(req, res) => {
    try {
        logger("info", req, "", lineNumber.__line)
        const errors = await seqValidator(req, [
            body('email')
                .exists()
                .withMessage(EMAIL_ERR)
                .custom(emailValidator),
            body('password')
                .exists()
                .withMessage(PASS_ERR),
            body('phone')
                .exists()
                .withMessage(CONTACT_ERR)
                .custom(phoneValidator),
            body('fullName')
                .exists()
                .withMessage(NAME_ERR)
        ])
        if (!errors.isEmpty()) {
            logger("error", req, {
                errors: errors.array()
            }, lineNumber.__line);
            return res
                .status(400)
                .send({
                    errors: errors.array()
                });
        }

        var {email, phone, password, fullName} = req.body

        password = await secureData.encrypt(password)

        const verificationCode = await randomNumber()

        const user = new usersModel({email, phone, password, fullName, verificationCode})

        const userObject = await user.save()

        if (userObject) {
            const exp = '1800s'
            const token = await createToken(userObject, exp)

            res
                .status(200)
                .send(token)

            sendSms(phone, verificationCode)

            sendMail(fullName, email, 1, verificationCode)

        } else {
            throw(STORE_ERR)
        }

    } catch (err) {
        logger("error", req, err, lineNumber.__line);
        console.log(err, lineNumber.__line);
        res
            .status(500)
            .send({
                errors: [
                    {
                        code: 500,
                        message: "Internal Server Error",
                        error: err
                    }
                ]
            });
    }
}
exports.loginWithOtp = async(req, res) => {
    try {
        logger("info", req, "", lineNumber.__line);
        const errors = await seqValidator(req, [
            param('otp')
                .exists()
                .withMessage(INVALID_ERR)
        ])
        if (!errors.isEmpty()) {
            logger("error", req, {
                errors: errors.array()
            }, lineNumber.__line);
            return res
                .status(400)
                .send({
                    errors: errors.array()
                });
        }
        if (req.user.otp === parseInt(req.params.otp)) {

            const userObject = await usersModel.findOneAndUpdate({
                id: req.user.id
            }, {
                isVerified: true
            }, {new: true})

            const token = await createToken(userObject, '120000d')

            return res
                .status(200)
                .send(token)
        } else 
            throw(WRONG_OTP)

    } catch (err) {
        logger("error", req, err, lineNumber.__line);
        console.log(err, lineNumber.__line);
        return res
            .status(500)
            .send({
                errors: [
                    {
                        code: 500,
                        message: "Internal Server Error",
                        error: err
                    }
                ]
            });
    }
}
exports.loginWithEmail = async(req, res) => {
    try {
        logger("info", req, "", lineNumber.__line);
        const errors = await seqValidator(req, [
            body('email')
                .exists()
                .withMessage(INVALID_ERR),
            body('password')
                .exists()
                .withMessage(PASS_ERR)
                .custom(checkPassword)
        ])
        if (!errors.isEmpty()) {
            logger("error", req, {
                errors: errors.array()
            }, lineNumber.__line);
            return res
                .status(400)
                .send({
                    errors: errors.array()
                });
        }
        const user = await usersModel.findOne({email: req.body.email, isVerified: true})

        if (user) {
            const token = await createToken(user, '120000d')
            return res
                .status(200)
                .send(token)
        } else {
            throw(NOT_EXIST + ' or ' + UNVERIFIED)
        }
    } catch (err) {
        logger("error", req, err, lineNumber.__line);
        return res
            .status(500)
            .send({
                errors: [
                    {
                        code: 500,
                        message: "Internal Server Error",
                        error: err
                    }
                ]
            });
    }
}
exports.resendOtp = async(req, res) => {
    try {
        logger("info", req, "", lineNumber._line)
        const errors = await seqValidator(req, [
            param('phone')
                .exists()
                .withMessage(CONTACT_ERR)
        ])
        if (!errors.isEmpty()) {
            logger("error", req, {
                errors: errors.array()
            }, lineNumber.__line);
            return res
                .status(400)
                .send({
                    errors: errors.array()
                });
        }

        const verificationCode = await randomNumber()
        const userObject = await usersModel.findOneAndUpdate({
            phone: req.params.phone
        }, {
            $set: {
                verificationCode: verificationCode
            }
        }, {new: true})
        if (userObject) {

            const exp = '1800s'

            const token = await createToken(userObject, exp)

            res
                .status(200)
                .send(token)

            sendSms(userObject.phone, verificationCode)

            sendMail(userObject.fullName, userObject.email, 1, verificationCode)
        } else {
            throw(STORE_ERR)
        }

    } catch (err) {
        logger("error", req, err, lineNumber.__line);
        console.log(err, lineNumber.__line);
        res
            .status(500)
            .send({
                errors: [
                    {
                        code: 500,
                        message: "Internal Server Error",
                        error: err
                    }
                ]
            });
    }
}