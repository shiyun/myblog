var mongodb = require('./db');
var Schema = mongodb.mongoose.Schema;
var markdown = require('markdown').markdown;

var date = new Date();
var time = {
	date: date,
	year : date.getFullYear(),
	month : date.getFullYear() + "-" + (date.getMonth() + 1),
	day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
	minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
	date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
};

var ArtSchema = new Schema({
	username: String,
	title: String,
	post: String,
	create_date: {type: String, default: time.minute},
});

var ArtsModel = mongodb.mongoose.model('arts', ArtSchema);

var ArtsDAO = function(){}

ArtsDAO.prototype.save = function(obj, callback){
	var instance = new ArtsModel(obj);
	instance.save(obj, function(err){
		callback(err);
	});
}

ArtsDAO.prototype.update = function(username, obj, callback){
	ArtsModel.update({username: username}, obj, function(err){
		callback(err);
	});
}

ArtsDAO.prototype.find = function(username, callback){
	ArtsModel.find({username: username}, function(err, obj){
		obj.forEach(function(post, index){
			post.post = markdown.toHTML(post.post);
		});
		callback(err, obj);
	});
}

ArtsDAO.prototype.findOne = function(obj, callback){
	ArtsModel.find(obj, function(err, objone){
		objone.forEach(function(post, index){
			post.post = markdown.toHTML(post.post);
		});
		callback(err, objone);
	});
}

ArtsDAO.prototype.findObj = function(obj, callback){
	ArtsModel.findOne(obj, function(err, obj){
		callback(err, obj);
	});
}

ArtsDAO.prototype.remove = function(username, callback){
	ArtsModel.remove({username: username}, function(err){
		callback(err);
	});
}

module.exports = new ArtsDAO();