const mongoose = require('mongoose');
const timeZone = require('mongoose-timezone');
const moment = require('moment');

const event = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    chairman: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    start_Time: { type: Date },
    end_Time: { type: Date },
    create_By: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approve: { type: String, default: "Pending" },
    venue: { type: String },
    topics: [{
        title: { type: String },
        notes: { type: String }
    }],
    participants: [{
        user_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        accept: { type: Boolean, default: false }
    }],
    date: { type: Date, default: moment().tz("Asia/Phnom_Penh").format() },
});

event.plugin(timeZone, { paths: ['date', 'start_Time', 'end_Time'] });
const model = mongoose.model('Event', event);
module.exports = model;
// default: () => moment().tz("Asia/Phnom_Penh").format()