var config = require('../config/config');
var mongoose = require('mongoose');

mongoose.connect(config.DB_PATH, function(err){
	if (err) throw err;
	console.log('========= mongo contented ===========');
});

exports.mongoose = mongoose;
