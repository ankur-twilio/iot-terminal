exports.handler = function(context, event, callback) {
    const twilioClient = context.getTwilioClient();
    let delay = event.delay || 0;
    let strings = event.message ? [event.message] : ["Test Message"];
    let author = event.author || "root";
    let request = twilioClient.sync.services(context.SYNC_SID)
       .syncLists('iot_terminal')
       .syncListItems
       .create({data:{
            "delay": delay,
            "strings": strings,
            "author": author
        }});
    
    request.then(function(result) {
       callback();
    });
};