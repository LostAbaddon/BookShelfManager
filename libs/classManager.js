/**
 * 这个类提供指向到指定Class的Delegate，用于访问控制。
 * -------------------------------------------
 * Ver	: 0.0.1
 * Date	: 2014.02.07
 * -------------------------------------------
 * class的structure：
 * ally		：友类列表，友类可访问friendly对象
 * 访问器		：public，private，protected，friendly
 * public	：对外公开
 * private	：类实例内部变量。所有不是其它三类的，都自动是private。
 * protected：同类实例可访问
 * friendly	：友类实例可访问
 * 对象内容	：method，property
 * method	：方法
 * property	：属性
 * 推荐使用method而非property
 *
 * -------------------------------------------
 * Ver	: 0.0.2
 * Date	: 2014.02.11
 * -------------------------------------------
 * 增加了Interface功能。
 * Interface是freezed的。
 */

const utils		= require('./utils');
const eventMgr	= require('./eventManager');

const isNull		= utils.isNull;
const freeze		= utils.freeze;
const eventalize	= eventMgr.eventalize;

const tagFun	= 'function';

function getStruct (instance) {
	var item;
	var struct = {
		method	: [],
		property: []
	};
	for (item in instance) {
		if (typeof instance[item] === tagFun) {
			struct.method.push(item);
		}
		else {
			struct.property.push(item);
		}
	}
	return {public : struct};
}

/**
 * kernel	：类实例
 * target	：类代理
 * struct	：类结构
 * level	：代理访问级
 *			  0：public，默认
 *			  1：friendly
 *			  2：protected
 */
function setDelegates (kernel, target, struct, level) {
	if (isNull(level)) level = 0;
	if (level < 0) return;
	
	set_delegates(kernel, target, struct.public);
	if (level > 0) set_delegates(kernel, target, struct.friendly);
	if (level > 1) set_delegates(kernel, target, struct.protected);
}
/**
 * 根据传入的struct设置delegate
 */
function set_delegates (kernel, target, struct) {
	if (isNull(struct)) return;
	var l, i, item;
	
	if (!isNull(struct.method)) {
		l = struct.method.length;
		for (i = 0; i < l; i += 1) {
			item = struct.method[i];
			(function (mName) {
				target[mName] = function () {
					if (!!kernel[mName]) return kernel[mName].apply(kernel, arguments);
					return null;
				};
			})(item);
		}
	}
	
	if (!isNull(struct.property)) {
		l = struct.property.length;
		for (i = 0; i < l; i += 1) {
			item = struct.property[i];
			(function (pName) {
				Object.defineProperty(target, pName, {
					get			: function () {return kernel[pName];},
					set			: function (newValue) {kernel[pName] = newValue;},
					enumerable	: true
				});
			})(item);
		}
	}
}

function classKeyRing (Class) {
	this.class = Class;
}

function classInterface (interface) {
	this.method		= interface.method || [];
	this.property	= interface.property || [];
}
classInterface.is = function (interface) {
	if (isNull(interface)) return false;
	return (interface instanceof classInterface);
};

function create (Class, Param) {
	if (isNull(Class)) return null;
	
	var keyRing = new classKeyRing(Class);
	
	// 生成真正的类实例对象
	var kernel = new Class(Param);
	
	// 获取类的结构，默认为全部方法和属性公开
	var struct = Class.structure || getStruct(kernel);
	
	// 创建代理
	var delegate = {};
	var friendDelegate = null;
	var protectedDelegate = null;
	
	// 事件处理
	var eventHandler = {};
	eventalize(eventHandler);
	
	// 根据自身KeyRing获取拓展代理
	var requestKeyRing = null;
	function getExtendInstance (obj) {
		if (isNull(obj)) return null;
		if (!obj.IsDelegate) return obj;
		obj.requestKeyRing = keyRing;
		return obj.extend;
	}
	function setRequestKeyRing (rKeyRing) {
		requestKeyRing = rKeyRing;
	}
	function getExtend () {
		if (requestKeyRing === null || !(requestKeyRing instanceof classKeyRing)) {
			requestKeyRing = null;
			return delegate;
		}

		var cls = requestKeyRing.class;
		if (isNull(cls)) {
			requestKeyRing = null;
			return delegate;
		}

		if (cls === Class) {
			if (protectedDelegate === null) {
				protectedDelegate = {};
				createDelegate(protectedDelegate, 2);
			}
			requestKeyRing = null;
			return protectedDelegate;
		}
		else if (!isNull(struct.ally)) {
			if (struct.ally.indexOf(cls) >= 0) {
				if (friendDelegate === null) {
					friendDelegate = {};
					createDelegate(friendDelegate, 1);
				}
				requestKeyRing = null;
				return friendDelegate;
			}
		}

		requestKeyRing = null;
		return delegate;
	}
	function createInterface (interface) {
		if (!classInterface.is(interface)) return null;
		var obj = {};
		set_delegates(this, obj, interface);
		freeze(obj);
		return obj;
	}
	
	function createDelegate (dele, level) {
		Object.defineProperty(dele, 'IsDelegate', {value : true});
		setDelegates(kernel, dele, struct, level);
		dele.getExtendInstance = getExtendInstance;
		Object.defineProperty(dele, 'requestKeyRing', {set : setRequestKeyRing});
		Object.defineProperty(dele, 'extend', {get	: getExtend});
		dele.interface = createInterface;
		dele.eventMgr = eventHandler;
	}
	
	createDelegate(delegate, 0);
	Object.defineProperty(kernel, 'delegate', {value : delegate});
	
	return delegate;
}

exports.create		= create;
exports.interface	= classInterface;