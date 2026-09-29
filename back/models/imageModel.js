const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema(
    {
        id_Image:{
            type: mongoose.Schema.Types.ObjectId,
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        id_User:{
            type: mongoose.Schema.Types.ObjectId,
        }
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Image', imageSchema)