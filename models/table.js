const mongoose = require('mongoose')

const tablesSchema = new mongoose.Schema({
    noTable: {
        type: String,
        required: true,
    },
},{timestamps: true})


module.exports = mongoose.model("Tables" , tablesSchema)