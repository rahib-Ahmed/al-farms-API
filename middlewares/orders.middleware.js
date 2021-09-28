const {NO_ACCESS} = require("../constants")
const lineNumber = require("../lineNumberFunction")
const logger = require("../logger")
const usersModel = require("../models/users.model")

exports.isUserOrder = async(req, res, next) => {

    try {
        logger("info", req, "", lineNumber.__line)
        const isUserOrder = await usersModel.findOne({
            _id: req.user.id,
            orderHistory: {
                $in: req.body.productId
            }
        })
        if (isUserOrder) {
            next()
        } else {
            throw(NO_ACCESS)
        }
    } catch (err) {}
}