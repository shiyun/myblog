var crypto = require('crypto'),
	uuid = require('node-uuid'),
    fs = require('fs'),
    Users = require('../models/users'),
    Posts = require('../models/post');
var express = require('express');
var router = express.Router();
var multer  = require('multer');
var storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, './public/images');
	},
	filename: function(req, file, cb){
		cb(null, file.originalname);
	}
});
var upload = multer({storage: storage});

router.get('/', function(req, res){
	Posts.find(req.session.username, function(err, obj){
		console.log(obj);
		res.render('index', {title: '主页', posts: obj, username: req.session.username,success: req.flash('success').toString(),error: req.flash('error').toString()})
	});
});

router.get('/login', checkNotLogin);
router.get('/login', function(req, res){
	res.render('login', {title: '登录', username: req.session.username,success: req.flash('success').toString(),error: req.flash('error').toString()})
});

router.post('/login', checkNotLogin);
router.post('/login', function(req, res){
	var md5 = crypto.createHash('md5'),
		pwd = md5.update(req.body.password).digest('hex');

	Users.find(req.body.username, function(err, userObj){
		if (!userObj.username){
			req.flash('error', '用户不存在');
			return res.redirect('/login');//用户不存在则跳转到登录页
		}
		if (userObj.password != pwd){
			req.flash('error', '密码错误');
			return res.redirect('/login');//用户不存在则跳转到登录页
		}
		req.session.username = req.body.username;
		res.redirect('/');
	});
});

router.get('/post', checkLogin);
router.get('/post', function(req, res){
	res.render('post', {title: '发表', username: req.session.username,success: req.flash('success').toString(),error: req.flash('error').toString()})
});

router.get('/post', checkLogin);
router.post('/post', function(req, res){
	var curUser = req.session.username,
		postData = {username: curUser, title: req.body.title, post: req.body.post};
	Posts.save(postData, function(err){
		if (err){
			req.flash('error', err);
			return res.redirect('/');
		}
		req.flash('success', '发布成功！');
		res.redirect('/');
	});
});

router.get('/logout', checkLogin);
router.get('/logout', function(req, res){
	req.session.username = null;
	req.flash('success', '登出成功!');
	res.redirect('/');//登出成功后跳转到主页
});

router.get('/reg', checkNotLogin);
router.get('/reg', function(req, res){
	if (req.session.username){
		return res.redirect('/');
	}
	res.render('reg', {title: '注册', username: req.session.username,success: req.flash('success').toString(),error: req.flash('error').toString()})
});

router.post('/reg', checkNotLogin);
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
	
	Users.findObj({email: newUser.email}, function(err, obj){
		if (err){
			req.flash('error', err);
			return res.redirect('/');
		}
		if (!!obj){
		console.log('yes: '+JSON.stringify(obj));
			if (obj.email){
				console.log('此邮箱已被注册！');
				req.flash('error', '此邮箱已被注册！');
				return res.redirect('/reg');
				//res.send({'result':{'message': '此邮箱已注册过！'},'status': {'code':'-1','desp':'此邮箱已注册过！'}});
			}

			if (obj.username){
				console.log('此用户名已被注册！');
				req.flash('error', '此用户名已被注册！');
				return res.redirect('/reg');
				//res.send({'result':{'message': '此邮箱已注册过！'},'status': {'code':'-1','desp':'此邮箱已注册过！'}});
			}

		}else{
			console.log('no: '+JSON.stringify(obj));
			Users.save(newUser, function(err){
				if (err){
					req.flash('error', err);
					return res.redirect('/reg');
				}
				//req.session.username = newUser.username;
				req.flash('success', '注册成功!');
				res.redirect('/');//注册成功后返回主页
			});
		}

	});
	

});

router.get('/upload', checkLogin);
router.get('/upload', function(req, res){
	res.render('upload', {
		title: '文件上传',
		username: req.session.username,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});

router.post('/upload', upload.fields([
{name: 'file1'},
{name: 'file2'},
{name: 'file3'},
{name: 'file4'},
{name: 'file5'}
]), function(req, res, next){
	for(var i in req.files){
        console.log(req.files[i]);
		
    }
    req.flash('success', '文件上传成功!');
    res.redirect('/upload');
});

function  returnResponse(err,res){
    if(!err){
        res.send({'result':{},'status': {'code':'1','desp':'ok'}});
    }else{
        res.send({'result':{},'status': {'code':'1','desp':'  + err + '}});
    }
}

function checkLogin(req, res, next){
	if (!req.session.username){
		req.flash('error', '未登录!'); 
		res.redirect('/login');
	}
	next();
}

function checkNotLogin(req, res, next){
	if (req.session.username){
		req.flash('error', '已登录!'); 
		res.redirect('back');
	}
	next();
}

module.exports =router;