var phoneToken = require('generate-sms-verification-code');
const Config = require('../config');
const VerifyPhoneCode = require('../models/verification-phone-code');

const sendOTP = function({phone, ip}) {
    const { accountSid, authToken, from } = Config.sms;
    const client = require('twilio')(accountSid, authToken);

    return new Promise((resolve, reject) => {
        const verificationCode = phoneToken(6, { type: 'number' });
        client.messages
            .create({
                body: '[Đơn hàng XKLD] Mã kiểm tra của bạn là ' + verificationCode,
                from: from,
                to: `+84${parseInt(phone)}`
            })
            .then(message => {
                // write to db
                try {
                    VerifyPhoneCode.createData({
                        phone,
                        code: verificationCode,
                        ip,
                        message,
                        expired_in: new Date().valueOf() + 15*60*60*1000
                    });
                } catch (exception) {
                    console.log(exception);
                }
                
                resolve({});
            })
            .catch(exception => {
                return reject(exception);
            })
    });
}
exports.sendOTP = sendOTP;
// module.exports = {
//     sendOTP
// }