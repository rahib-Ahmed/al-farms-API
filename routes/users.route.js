var express = require('express');
var router = express.Router();

const {signupUser, loginWithOtp, resendOtp, loginWithEmail} = require('../controllers/users.controller');
const {auth, checkPhone} = require('../middlewares/verify.middleware')


router.post('/signup', signupUser);

router.get('/verify/:otp', auth, loginWithOtp);

router.get('/resend/:phone', checkPhone, resendOtp);

router.post('/login', loginWithEmail);


module.exports = router;
