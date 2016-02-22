var crypto = require('crypto'),
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

module.exports =router;