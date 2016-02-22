var crypto = require('crypto'),
	uuid = require('node-uuid'),
    fs = require('fs'),
    Users = require('../models/users');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	res.render('index', {title: '主页'})
});

router.get('/reg', function(req, res){
	res.render('reg', {title: '注册'})
});

router.get('/login', function(req, res){
	res.render('login', {title: '登录'})
});

router.get('/post', function(req, res){
	res.render('reg', {title: '发表'})
});

router.get('/logoout', function(req, res){
	res.render('reg', {title: '注册'})
});

router.post('/reg', function(req, res){
	var name = req.body.name,
		pwd = req.body.password,
		pwd_re = req.body['password-repeat'],
		email = req.body.email;
	
	if (pwd != pwd_re){
		req.flash('error', '两次输入的密码不一致！');
		console.log('两次输入的密码不一致！');
		return res.redirect('/reg');
	}

	var md5 = crypto.createHash('md5');
		password = md5.update(pwd).digest('hex');
	
	var newUser = {
		userid: uuid.v4(),
		username: name,
		password: password,
		email: email
	};
	
	Users.save(newUser, function(err){
		returnResponse(err, res);
	});

});

function  returnResponse(err,res){
    if(!err){
        res.send({'result':{},'status': {'code':'1','desp':'ok'}});
    }else{
        res.send({'result':{},'status': {'code':'1','desp':'  + err + '}});
    }
}

module.exports =router;