//var rp = require('request-promise');
var request = require('request');

exports.handler = function (req, res) {

    console.log('Now try Simple request');
    console.log(req);

    var replyUrl = 'https://api.line.me/v2/bot/message/reply';

    var messages = [
        {
            "type":"text",
            "text": '9527 calling...'
        }
    ];

    //Make get Request
    var requestSettings  = {
        url: content_url,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": " Bearer " + ChannelAccessToken
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