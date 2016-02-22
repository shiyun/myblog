var mongodb = require('./db');
var Schema = mongodb.mongoose.Schema;

var CounterSchema = Schema({
    uid: {type: String, required: true},
    seq: { type: Number, default: 0 }
});

module.exports = CounterSchema;