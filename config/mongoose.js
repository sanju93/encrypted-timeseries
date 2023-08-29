let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/TimeSeries')
.then(
() => console.log("Database Connected Successfully"),
(err) => console.log(err)
)


module.exports = mongoose;