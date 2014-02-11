function _on (eventMgr, eventName, callback) {
	if (!eventName || !callback) return;
	eventMgr[eventName] = eventMgr[eventName] || [];
	eventMgr[eventName].push([callback, false]);
}
function _once (eventMgr, eventName, callback) {
	if (!eventName || !callback) return;
	eventMgr[eventName] = eventMgr[eventName] || [];
	eventMgr[eventName].push([callback, true]);
}
function _off (eventMgr, eventName, callback) {
	if (!eventName) return;
	var handlers = eventMgr[eventName];
	if (!handlers) return;
	var index;
	if (!callback) {
		eventMgr[eventName] = [];
	}
	else {
		index = handlers.filter(function (item) {
			if (item[0] === callback) return true;
			return false;
		});
		if (index.length > 0) {
			handlers.splice(index[0], 1);
		}
	}
}
function _fire (host, eventMgr, eventName, parameters) {
	if (!eventName || !parameters) return;
	var handlers = eventMgr[eventName];
	var handler;
	if (!handlers) return;
	var len = handlers.length;
	var i;
	for (i = 0; i < len; i += 1) {
		handler = handlers[i];
		handler[0].apply(obj, parameters);
		if (handler[1]) {
			handlers.splice(i, 1);
			i --;
			len --;
		}
	}
}

function createEvent (obj) {
	var eventHandlers = {};

	obj.on = function (eventName, callback) {
		_on(eventHandlers, eventName, callback);
	};
	obj.once = function (eventName, callback) {
		_once(eventHandlers, eventName, callback);
	};
	obj.off = function (eventName, callback) {
		_off(eventHandlers, eventName, callback);
	};
	obj.fire = function () {
		var len = arguments.length;
		if (len < 2) return;
		var eventName = arguments[0];
		var parameters = [];
		var i;
		for (i = 1; i < len; i += 1) {
			parameters.push(arguments[i]);
		}
		_fire(obj, eventHandlers, eventName, parameters);
	};
};

exports.eventalize = createEvent;