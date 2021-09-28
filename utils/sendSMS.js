const accountSid = `${process.env.TWILIO_ACCOUNT_SID}`;
const authToken = `${process.env.TWILIO_AUTH_TOKEN}`;

exports.sendSms = async (to, otp) => {
    const from = `${process.env.TO_PHONE}`
    const client = require('twilio')(accountSid, authToken);

    // console.log("🚀 ~ file: sendSMS.js ~ line 7 ~ exports.sendSms= ~ otp", otp)
    // console.log("🚀 ~ file: sendSMS.js ~ line 7 ~ exports.sendSms= ~ to", to)

    await client
        .messages
        .create({body: `'Your verification code is : ${otp}. Do not share this with anyone'`, from: from, to: to})
        .then((res) => {

            // console.log("🚀 ~ file: sendSMS.js ~ line 18 ~ .then ~ message", res.status)

        });
}