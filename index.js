var rp = require('request-promise');
var aws = require('aws-sdk');

exports.handler = function (req, res) {

    console.log(req);

    var S3Imagebucket = 'q3buxya';

    const promises = req.events.map(event => {

        console.log('I am here');

        switch(event.message.type)
        {
            case 'text':
                var msg = event.message.text.toUpperCase();
                break;

            case 'image':
                // var msg = 'You Send an Image';
                // gotUserMessage = false;
                var img_id = event.message.id;
                content_url = "https://api.line.me/v2/bot/message/" + img_id + "/content";

                //Make get Request
                var requestSettings  = {
                    url: content_url,
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        "Authorization": " Bearer " + process.env.CHANNEL_ACCESS_TOKEN
                    },
                    method: 'GET',
                    encoding: null
                };

                request(requestSettings, function(error, response, body) {
                    // Use body as a binary Buffer
                    //imageName = 'WeddingHelper/L30/photos/' + img_id + '.jpg';
                    imageName = img_id + '.jpg';

                    //Here Upload to S3
                    var s3Bucket = new AWS.S3({params:{Bucket:S3Imagebucket} });
                    var data = {
                        Key: imageName,
                        Body: body,
                        ContentType: "image/jpeg"
                    };

                    s3Bucket.upload(data, function(err, data){
                        if (err)
                        { console.log('Error uploading data: ', data);}
                        else
                        {
                            console.log('Successfully uploaded the image! Yo');
                        }
                    });
                });//end of request

                msg = 'PhotoUploaded!';
                break;

            default:
                var msg = 'Hmmmm';
                break;
        }//end of Switch case


        var replyMessages = [
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
                    "Authorization": " Bearer " + process.env.CHANNEL_ACCESS_TOKEN
                },
                json: true,
                body: {
                    replyToken: event.replyToken,
                    replyMessages
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