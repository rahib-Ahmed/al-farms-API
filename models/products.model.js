var mongoose = require('mongoose');
const {Schema} = mongoose;
const ProductSchema = new mongoose.Schema({
    name: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Reviews'
        }
    ],
    isDeleted: {
        type: Boolean,
        default: false
    }, 
    isArchived: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {versionKey: false})
module.exports = mongoose.model('Products', ProductSchema, 'Products');