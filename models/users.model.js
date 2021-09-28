var mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new mongoose.Schema({

    email: String,
    password: String,
    phone: Number,
    fullName: String,
    googleId: String,
    facebookId: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: Number,
    deals: {
        type: Boolean,
        default: false
    },
    token: String,
    orderHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'History'
        }
    ]
    
}, {versionKey: false})
module.exports = mongoose.model('User', UserSchema, 'User');