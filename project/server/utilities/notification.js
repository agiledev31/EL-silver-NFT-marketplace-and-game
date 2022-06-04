let mongoose = require("mongoose");
let Notification = mongoose.model('Notification');

const sendNotification = ({title,type,sentTo,user = null,data= {}}) => {
    lolSocket.emit('notification'+sentTo);
    
    new Notification({
        title,
        type,
        user,
        sentTo,
        data}).save().then(doc => {
            // TODO check here if user is online
        });
    
    
};

module.exports = { 
    sendNotification
};
