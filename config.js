const fs	= require('fs');

const utils	= require('./libs/utils');

const isNull	= utils.isNull;

const SettingFile	= './config/setting.config';

var cbLoad			= null;
var setting			= null;
var pathConfig		= {};
var patternConfig	= {};
var shelfConfig		= {};
var propConfig		= {};
var tagConfig		= {};

exports.state	= 0; // -1: No Such File; 0: Idle; 1: Reading; 2: Completed

function readSetting (err, data) {
	if (!isNull(err)) {
		exports.state = -1;
		return;
	}
	data = data.toString();
	setting = data.toString().toJSON();
	exports.state = 2;
	if (cbLoad !== null) cbLoad();
}

function checkSetting (err, stats) {
	if (!isNull(err)) {
		exports.state = -1;
		return;
	}
	exports.state = 1;
	fs.readFile(SettingFile, readSetting);
}

exports.load = function (callback) {
	cbLoad = callback;
	fs.stat(SettingFile, checkSetting);
};