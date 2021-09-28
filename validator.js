const { validationResult, body, check } = require("express-validator");
const usersModel = require("./models/users.model");
// const jwt = require('jsonwebtoken');
const secureData = require('./utils/secureData')
// const {capitalizeFirstLetter} = require('./utils/generateNumber')
// const {STUDENT, TEACHER} = require('./constants')

const parallelValidator = async (req, validations) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    return validationResult.withDefaults({
        formatter: (error) => {
            return error.msg instanceof Object
                ? error.msg
                : error;
        }
    })(req);
};

const seqValidator = async (req, validations) => {
    for (let validation of validations) {
        const result = await validation.run(req);
        if (result.errors.length)
            break;
    }
    return validationResult.withDefaults({
        formatter: (error) => {
            return error.msg instanceof Object
                ? error.msg
                : error;
        }
    })(req);
};
// // validating Ids : const idValidation = async (re)
// const emailValidator = async (email, { req }) => {
//     // console.log("insid validator", email)
//     return userModel
//         .findOne({ email: email })
//         .then((chk) => {
//             if (chk)
//                 return Promise.reject('E-mail already exist')
//         })
// }
const emailValidator = async (email, { req }) => {
    // console.log("insid validator", email)
    return usersModel
        .findOne({ email: email })
        .then((chk) => {
            if (chk)
                return Promise.reject('E-mail already exist')
        })
}
const phoneValidator = async (phone, { req }) => {
    // console.log("insid validator", email)
    return usersModel
        .findOne({ phone: phone })
        .then((chk) => {
            if (chk)
                return Promise.reject('Phone already exist')
        })
}
const checkPassword = async (paswordRequested, { req }) => {
    
    return usersModel
        .findOne({ email: req.body.email })
        .then(async (chk) => {
            if (!chk) {
                return Promise.reject("User does not exist")
            } else {
                const password = await secureData.decrypt(chk.password)
            
                if (password != paswordRequested) {
                    return Promise.reject("Wrong username or password")
                }
            }
        })
}


exports.seqValidator = seqValidator;
exports.parallelValidator = parallelValidator;
exports.emailValidator = emailValidator;
exports.phoneValidator = phoneValidator;
exports.checkPassword = checkPassword;
