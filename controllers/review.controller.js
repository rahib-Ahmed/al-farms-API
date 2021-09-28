const { THANK_YOU } = require('../constants')
const productsModel = require('../models/products.model')
const reviewsModel = require('../models/reviews.model')
const usersModel = require('../models/users.model')
const {ReviewUser} = require('../utils/creatingObject')

exports.addReview = async(req, res) => {
    try {

        logger("info", req, "", lineNumber.__line)
        const errors = await seqValidator(req, [
            body("productId")
                .exists()
                .withMessage("Mandatory"),
            body("review")
                .exists()
                .withMessage("Mandatory"),
            body("starGiven")
                .exists()
                .withMessage("Mandatory")
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

        const reviewObject = await productsModel
            .findOne({
            _id: req.body.productId,
            reviews: {
                $exists: true
            }
        })
        .populate('reviews')

        const reviewByUser = await new ReviewUser(req.user.id, req.body.review, req.body.starGiven, "")

        if (reviewObject) {

            reviewObject.reviews.rating.totalStar += parseInt(req.body.starGiven)
            reviewObject.reviews.rating.totalVotes += 1
            reviewObject.reviews.rating.avgRating = reviewObject.reviews.rating.totalStar / reviewObject.reviews.rating.totalVotes

            const update = {
                rating: reviewObject.reviews.rating,
                $addToSet: {
                    reviews: reviewByUser
                }
            }
            const reviewAdded = await reviewsModel.findOneAndUpdate({
                _id: reviewObject.reviews._id
            }, update, {new: true})

            if (reviewAdded) {
                await usersModel.findOneAndUpdate({
                    _id: req.user.id
                }, {
                    $addToSet: {
                        reviews: req.body.productId
                    }
                })
                return res
                    .status(200)
                    .send(THANK_YOU);
            }

        } else {
            
            const rating = {
                totalStar: req.body.starGiven,
                totalVotes: 1,
                avgRating: req.body.starGiven
            }
            
            const review = new reviewsModel({productId: req.body.productId, rating, reviews: reviewByUser})

            const reviewObject = await review.save()
            
            if (reviewObject) {
                await productsModel.findOneAndUpdate({
                    _id: req.body.profuctId
                }, {
                    reviews: reviewObject._id
                })
            }

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