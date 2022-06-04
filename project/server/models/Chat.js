var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


var ChatSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    sentTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    message: String,
},
{ timestamps: true });
ChatSchema.plugin(mongoosePaginate);

mongoose.model('Chat', ChatSchema);