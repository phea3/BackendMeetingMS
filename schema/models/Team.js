const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const team = new mongoose.Schema({
    title: { type: String, unique: true, required: 'The Title is required' },
    description: { type: String },
    image_name: { type: String },
    image_src: { type: String },
    create_At: { type: Date, default: new Date().toISOString() },
    update_At: { type: Date, default: new Date().toISOString() },
    leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, }]
});
team.plugin(uniqueValidator);
const model = mongoose.model('Team', team);
module.exports = model;

