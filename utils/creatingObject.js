class ReviewUser {
   
    constructor(reviewerId, review, starGiven, reviewDate) {
        this.reviewerId = reviewerId
        this.review = review
        this.starGiven = parseInt(starGiven)
        this.reviewDate = reviewDate
    }
}

module.exports = {
    ReviewUser: ReviewUser
}