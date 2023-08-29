let mongoose = require('mongoose');

let dataSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    city : {
        type : String,
        require : true
    },
    secret_key : {
        type : String,
        require : true
    }
},{
    timestamps : true
});

let Data = mongoose.model('Data',dataSchema);

module.exports = Data;