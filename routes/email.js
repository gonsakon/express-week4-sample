var express = require('express');
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");
const router = express.Router();
const validator = require('validator');

const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;


router.post('/personalMail', handleErrorAsync(async function(req, res,next) {
    const { to, subject, text } = req.body;
    // 內容不可為空
    if(!to||!subject|!text){
        return next(appError("400","欄位未填寫正確！",next));
    }
    // 是否為 Email
    if(!validator.isEmail(to)){
        return next(appError("400","Email 格式不正確",next));
    }
    const oauth2Client = new OAuth2(
        process.env.GOOGLE_AUTH_CLIENTID, 
        process.env.GOOGLE_AUTH_CLIENT_SECRET, 
        "https://developers.google.com/oauthplayground" 
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_AUTH_REFRESH_TOKEN
    });

    const accessToken = oauth2Client.getAccessToken()

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: "OAuth2",
            user: "gonsakon@gmail.com", 
            clientId: process.env.GOOGLE_AUTH_CLIENTID,
            clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_AUTH_REFRESH_TOKEN,
            accessToken: accessToken
        }
    });

    const mailOptions = {
        from: '廖洧杰 <gonsakon@gmail.com>',
        to,
        subject,
        text
    };


    await transporter.sendMail(mailOptions);

    res.status(200).json({
        status: 'success',
        message: "信件發送成功"
    });
}));

module.exports = router;