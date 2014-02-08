const fork	= require('child_process').fork;

const express	= require('express');
const socket	= require('socket.io');
const assert	= require('assert');
const util		= require('util');

const classMgr	= require('./libs/classManager');
const taskMgr	= require('./libs/taskManager');
const config	= require('./config');

var spider = fork('./spider.js');
var spider_ready = false;

function messageCallback (data) {
	console.log(data);
}

spider.on('message', messageCallback);

config.load(function () {
	console.log('Config State: ' + config.state);
});

spider.send({cmd : 'state'});