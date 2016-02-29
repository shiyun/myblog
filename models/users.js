var mongodb = require('./db');
var Schema = mongodb.mongoose.Schema;

var UsersSchema = new Schema({
	userid: String,
	username: String,
	password: String,
	email: String,
	create_date: {type: Date, default: Date.now},
});

var UsersModel = mongodb.mongoose.model('users', UsersSchema);

var UsersDAO = function(){}

UsersDAO.prototype.save = function(obj, callback){
	var instance = new UsersModel(obj);
	instance.save(obj, function(err){
		callback(err);
	});
}

UsersDAO.prototype.update = function(username, obj, callback){
	UsersModel.update({username: username}, obj, function(err){
		callback(err);
	});
}

UsersDAO.prototype.find = function(username, callback){
	UsersModel.findOne({username: username}, function(err, obj){
		callback(err, obj);
	});
}

UsersDAO.prototype.findObj = function(obj, callback){
	UsersModel.findOne(obj, function(err, obj){
		callback(err, obj);
	});
}

UsersDAO.prototype.remove = function(username, callback){
	UsersModel.remove({username: username}, function(err){
		callback(err);
	});
}

module.exports = new UsersDAO();