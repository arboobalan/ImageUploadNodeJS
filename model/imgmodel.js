const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    username: {
        type: String,
        reruired: true
    },
    image: {
        type: String,
        reruired: true
    }
}, {
    timestamps: true,
    versionKey: false
});

const imageModel = mongoose.model('imageModel', imageSchema, 'imageModel');
module.exports = imageModel;