//var rp = require('request-promise');
var request = require('request');

exports.handler = function (req, res) {

    console.log('Now try Simple request 1134');
    console.log(req);

    //const ChannelAccessToken = process.env.CHANNEL_ACCESS_TOKEN;
    const replyUrl = 'https://api.line.me/v2/bot/message/reply';

    var messages = [
        {
            "type":"text",
            "text": '9527 calling...'
        }
    ];

    //Make get Request
    var requestSettings  = {
        url: replyUrl,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": " Bearer " + process.env.CHANNEL_ACCESS_TOKEN
        },
        method: 'POST',
        encoding: null,
        json: true,
        body: {
            replyToken: reply_token,
            messages
        }
    };


    request(requestSettings, function(error, response, body) {
        //make a request
        console.log('request completed');
    });
};