const mongoose = require("mongoose");
const expoToken = new mongoose.Schema({
    token: String
});

const model = mongoose.model('ExpoToken', expoToken);
module.exports = model;
