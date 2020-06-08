const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        maxlength: 100
    },
    body: {
        type: String,
        required: true,
        maxlength: 2000
    },
    photos: [{
        link: String,    //store links to the post images
        public_id:String
    }],
    price: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 32
    },

    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date
});

module.exports = mongoose.model("Post", postSchema);
