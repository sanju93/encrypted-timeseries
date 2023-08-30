let mongoose = require('mongoose');
//mongodb://localhost:27017/TimeSeries
mongoose.connect('mongodb+srv://sanjay139474:sanjay139474@cluster0.qopktum.mongodb.net/?retryWrites=true&w=majority')
.then(
() => console.log("Database Connected Successfully"),
(err) => console.log(err)
)


module.exports = mongoose;