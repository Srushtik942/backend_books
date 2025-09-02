const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author:{
        type:String,
        required: true
    },
    publishedYear : {
        type: Number
    },
    genre:[{
        type: String,
        enum:["Non-fiction", "Business","Autobiography"]
    }],
    language: {
        type: String,
        required: true
    },
    country:{
        type:String
    },
    rating:{
        type:String
    },
    summary:{
        type: String,
        required: true
    },
    coverImageUrl : {
        type: String
    }
});

const Book = mongoose.model("Book",bookSchema);

module.exports = Book