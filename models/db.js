var config = require('../config/config');
var mongoose = require('mongoose');

var options = {
    server: {
        auto_reconnect: true,
        poolSize: 5
    }
};

mongoose.connect(config.DB_PATH, options, function(err){
	if (err) throw err;
	console.log('========= mongo contented ===========');
});

exports.mongoose = mongoose;
