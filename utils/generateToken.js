const jwt = require('jsonwebtoken');
const secureData = require('./secureData')
    
    exports.generateToken = async(obj, exp) => {
        const access_token = jwt.sign(obj, `${process.env.ACCESS_TOKEN_SECRET}`, {expiresIn: exp});
        const token_gen = secureData.encrypt(access_token)
        return token_gen;
    };

    exports.createToken = async function (data, exp) {
        
        const objs = {
            name: data.fullName,
            email: data.email,
            phone: data.phone,
            id: data._id,
            verified: data.isVerified,
            otp: data.verificationCode
        }

        const access = await module.exports.generateToken(objs, exp)
        
        return { access }
    }