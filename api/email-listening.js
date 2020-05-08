const simpleParser = require('mailparser').simpleParser;
const _ = require('lodash');
var imaps = require('imap-simple');
const Contract = require('./server/models/contract');
const MongoModels = require('mongo-models');
const notifier = require('mail-notifier');
const fs = require('fs');
var config = {
    imap: {
        user: "huongdt@shchr.com.vn",
        password: "Golden123",
        host: "mail.shchr.com.vn",
        port: 993,
        tls: true,
        authTimeout: 3000,
        tlsOptions: { rejectUnauthorized: false }
    }
};

notifier(config.imap)
    .on('mail', (mail) => {
        console.log('new email comming ', mail.subject);
        if (isEmailContract(mail.subject)) {
            for (const attachment of mail.attachments) {
                fs.writeFileSync("./attachments/" + attachment.fileName, attachment.content, "binary");
            }
            
            writeContract({
                ...mail,
                id: mail.uid
            })
        }
    })
    .start();

let imapConnection;



// connection to get old email
async function connectMongo() {
    await MongoModels.connect({
        uri: 'mongodb://xkld_new:123DFGrewqq123YUI@149.28.148.145:27017/xkld',
        db: 'xkld'
    }, {});
}

connectMongo();
imaps.connect(config).then(function (connection) {
    imapConnection = connection;
    connection.openBox('INBOX').then(function () {
        var delay = 24 * 2 * 3600 * 1000; // last 20 days
        var delay1 = 24 * 2 * 3600 * 1000; // last 20 days
        var from = new Date();
        from.setTime(Date.now() - delay);
        from = from.toISOString();

        var to = new Date();
        to.setTime(Date.now() - delay1);
        to = to.toISOString();
        
        // var searchCriteria = [['SINCE', '21-Mar-2019']];
        var searchCriteria = [['UID', '34000:*']];
        var fetchOptions = {
            bodies: ['HEADER', 'TEXT', ''],
            struct: true,
            date: true,
            uid: true
        };

        // retrieve only the headers of the messages
        return connection.search(searchCriteria, fetchOptions);
    }).then(async function (messages) {
        console.log('messages ', messages.length);
        for (const item of messages) {
            let parsedEmail = await parseEmail(item);
            console.log('parsedEmail.subject ', parsedEmail.subject, ' uid', parsedEmail.id);
            if (isEmailContract(parsedEmail.subject)) {
                let attachments = await getAttachments(item);
                writeContract({
                    ...parsedEmail,
                    attachments: attachments
                })   
            }
        }
        return Promise.all([]);
    })
});

function parseEmail(message) {
    return new Promise((resolve, reject) => {
        var all = _.find(message.parts, { "which": "" })
        var id = message.attributes.uid;
        var idHeader = "Imap-Id: " + id + "\r\n";
        simpleParser(idHeader + all.body, (err, mail) => {
            if (err) {
                return reject(err);
            }
            return resolve({
                subject: mail.subject,
                html: mail.html,
                date: mail.date,
                id: id
            });
        });
    });
}

function getAttachments(message) {
    try {
        return new Promise((resolve, reject) => {
            var parts = imaps.getParts(message.attributes.struct);

            let attachments = [];
            attachments = attachments.concat(parts.filter(function (part) {
                return part.disposition && part.disposition.type.toUpperCase() === 'ATTACHMENT';
            }).map(function (part) {
                // retrieve the attachments only of the messages with attachments
                return imapConnection.getPartData(message, part)
                    .then(function (partData) {
                        // save file
                        let filename = message.attributes.uid + '_' + new Date().valueOf() + "." + part.subtype;
                        fs.writeFileSync("./attachments/" + filename, partData, "binary");
                        
                        return {
                            filename: filename,
                            data: partData,
                            contentType: part.type + "/" + part.subtype
                        };
                    });
            }));
            return resolve(Promise.all(attachments));
        });
    } catch (exception) {
        console.log(exception);
    }
    
}

function isEmailContract(emailSubject) {
    let subject = emailSubject.replace(/\[.*\]/, '').trim().toUpperCase();
    return subject.indexOf('TBĐH') == 0 ||
        subject.indexOf('THÔNG BÁO ĐƠN HÀNG') == 0 ||
	subject.indexOf('THÔNG BÁO ĐH') == 0 ||
	subject.indexOf('KỸ SƯ') == 0 ||
	subject.indexOf('TB ĐƠN HÀNG') == 0 ||
	subject.indexOf('NAM ') == 0 ||
	subject.indexOf('NỮ ') == 0 ||
	subject.indexOf('ĐƠN HÀNG') == 0 ||
        subject.indexOf('TBDH') == 0;
}

const writeContract = function(message) {

    Contract.create({
        id: message.id.toString(),
        created_at: message.date,
        title: message.subject,
        content: message.html,
        attachments: message.attachments
    })
}

const express = require('express');
const app = express();
const port = 8080;

app.use(express.static('./attachments'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
