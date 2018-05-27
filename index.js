var rp = require('request-promise');

exports.handler = function (req, res) {

    console.log(req);

    const promises = req.events.map(event => {

        var msg = event.message.text.toUpperCase();
        var reply_token = event.replyToken;
        const ChannelAccessToken = process.env.CHANNEL_ACCESS_TOKEN;


        console.log('I am here');

        var messages = [
            {
                "type":"text",
                "text": msg
            }
        ];

        needToReply = true;

        if(needToReply){

            var options = {
                method: 'POST',
                uri: "https://api.line.me/v2/bot/message/reply",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Authorization": " Bearer " + ChannelAccessToken
                },
                json: true,
                body: {
                    replyToken: reply_token,
                    messages
                }
            };

            return rp(options)
                .then(function (response) {
                    console.log("Success : " + response);
                }).catch(function (err) {
                    console.log("Error : " + err);
                });

        }//Otherwiese no need to reply
    });

    Promise
        .all(promises)
        .then(() => res.json({success: true}));

};