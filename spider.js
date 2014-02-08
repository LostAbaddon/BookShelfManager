const fs	= require('fs');

const utils	= require('./libs/utils');

const isNull	= utils.isNull;

var state	= 0; // 0: idle; 1: reading configs; 2: reading folders; 3: analysing files
var proc	= 0;

function currentState () {
	return {
		state	: state,
		process	: proc
	};
}

function messageCallback (data) {
	if (isNull(data)) return;
	var cmd = data.cmd;
	if (isNull(cmd)) return;
	
	if (cmd === 'state') process.send({
		cmd		: cmd,
		result	: currentState()
	});
}

process.on('message', messageCallback);