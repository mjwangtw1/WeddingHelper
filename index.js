var rp = require('request-promise');
var request = require('request');
var AWS = require('aws-sdk');

exports.handler = function (req, res) {

    console.log(req);

    var S3Imagebucket = 'q3buxya'; //Flip back first.
    var EXPORT_PATH = 'WeddingHelper/L30/photos/';
    var EXPORT_JSON = 'WeddingHelper/L30/web/';
    var URL_PATH = 'https://s3-us-west-2.amazonaws.com/';

    const promises = req.events.map(event => {

        console.log('I am here 1108');
        var needToReply = false;
        // var smile = false;

        switch(event.message.type)
        {
            case 'text':
                var msg = event.message.text.toUpperCase();
                break;

            case 'image':
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
                    imageName = EXPORT_PATH + img_id + '.jpg';

                    //Here Upload to S3
                    var s3Bucket = new AWS.S3({params:{Bucket:S3Imagebucket}});
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

                    //Generate List Json
                    var params = {
                        Bucket: S3Imagebucket, 
                        MaxKeys: 500
                    };
                    s3Bucket.listObjects(params, function(err, data) {
                       if (err)
                       {
                          console.log(err, err.stack);
                          callback(err);
                        //Toss back error
                       }else{

                          console.log('data');
                          console.log(data);

                          var images = [];
                          var result = data.Contents.forEach(function(item, index, array){
                            images.push(item.Key);
                          });

                          images.reverse();

                          // callback(null, images);

                          s3Bucket.putObject(
                          {
                            Bucket: S3Imagebucket,
                            Key: EXPORT_JSON + 'images.json',
                            Body: JSON.stringify(images),
                            ContentType: 'application/json'
                          },function(err){
                            console.log('Err!');
                            console.log(err);
                          });   

                          console.log('Write JSON complete');
                       }// an error occurred
                    });


                    // console.log('Upload Over');

                });//end of request

                msg = '已幫您上傳照片, : )';
                // msg = '相片已上傳 <br/>' + URL_PATH + S3Imagebucket + imageName;
                needToReply = true;
                // smile = true;
                break;

            default:
                var msg = 'Hmmmm';
                break;
        }//end of Switch case


        if(needToReply){
            var messages = [
                {
                    "type":"text",
                    "text": msg
                }
            ];

            // //Add a Leo Smile face after Upload
            // if(smile){
            //     messages[1].type = "image";
            //     messages[1].originalContentUrl = 'https://i.imgur.com/e2AUPxc.png';
            //     messages[1].previewImageUrl = 'https://i.imgur.com/e2AUPxc.png';
            // }

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
                    messages
                }
            };

            return rp(options)
                .then(function (response) {
                    console.log("Success : " + response);
                }).catch(function (err) {
                    console.log("Error : " + err);
                });
        }
    });

    Promise
        .all(promises)
        .then(() => res.json({success: true}));

};