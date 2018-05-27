exports.handler = (event, context, callback) => {
    // TODO implement

    const ChannelAccessToken = process.env.CHANNEL_ACCESS_TOKEN;

    var reply_token = event.replyToken; //Need to get this Token to pass back.
    var messages = [{
        "type":"text",
        "text": event.message.text
    }];

    callback(null, messages);
};