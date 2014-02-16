const utils		= require('./utils');
const classMgr	= require('./classManager');

const isNull	= utils.isNull;
const create	= classMgr.create;
const interface	= classMgr.Interface;

function pipe (consumable) {
	var tasks = [];
	var back;
	var running = false;
	if (isNull(consumable)) consumable = true;
	else consumable = !!consumable;
	
	if (!consumable) back = [];
	
	this.add = function (task) {
		if (isNull(task)) return;
		tasks.push(task);
	};
	this.remove = function (task) {
		var index = tasks.indexOf(task);
		if (index >= 0) tasks.splice(index, 1);
	};
	this.append = function (lastTask, newTask) {
		var index = tasks.indexOf(lastTask);
		if (index == -1) index = tasks.length - 1;
		tasks.splice(index, 0, newTask);
	};
	
	function doJob () {
		var task = tasks.splice(0, 1);
		if (isNull(task)) {
			this.done();
		}
		else {
			if (!consumable) back.push(task);
			task();
		}
	}
	
	this.run = function () {
		running = true;
		doJob();
	};
	this.done = function () {
		if (tasks.length > 0) {
			doJob();
		}
		if (!consumable) {
			tasks = back;
			back = [];
		}
		running = false;
	};
}