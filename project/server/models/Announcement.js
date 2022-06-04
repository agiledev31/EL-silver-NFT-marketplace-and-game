let mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

let AnnouncementSchema = new mongoose.Schema({
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, default: null },
    isDelete: { type: Boolean, default: false }
}, { timestamps: true });
AnnouncementSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Announcement', AnnouncementSchema);