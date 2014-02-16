const ClassMgr	= require('../classManager');

const create	= ClassMgr.create;
const Interface	= ClassMgr.interface;

function classPerson (name) {
	this.name = name;
	this.age = 0;
	this.alive = true;
}
classPerson.prototype.aged = function () {
	if (!this.alive) return;
	this.age += 1;
	if (this.age > 5) this.alive = false;
};
classPerson.prototype.isAlive = function () {
	return this.alive;
};
classPerson.prototype.fight = function () {
	return 100 - this.age * 10;
};
classPerson.prototype.wtf = function () {
	return 10;
};
classPerson.prototype.test = function (test) {
	console.log('=========    Protected:');
	test = this.delegate.getExtendInstance(test);
	console.log(test);
	console.log(test.wtf());
	var itf = new Interface({
		method	: ['wtf'],
		property: ['age']
	});
	var del = test.interface(itf);
	console.log(del);
	console.log(del.wtf());
	console.log(del.age);
};

function classObject (Person) {
	this.id = this.total++;
	this.person = Person;
}
classObject.prototype.type	= 'Class Object';
classObject.prototype.total	= 0;
classObject.prototype.test = function (person) {
	person = person || this;
	console.log('=========    Friendly:');
	person = person.delegate.getExtendInstance(person.person)
	console.log(person);
	var itf = new Interface({
		method	: ['fight'],
		property: ['name']
	});
	var del = person.interface(itf);
	console.log('xxxxxxxxxxxxxxxxx');
	console.log(del);
	console.log(del.fight());
	console.log(del.name);
};

classPerson.structure = {
	ally		: [classObject],
	public		: {
		method	: ['isAlive', 'aged', 'test'],
		property: ['name'],
		event	: ['AA', 'BB'],
		invoker	: ['AA', 'CC']
	},
	protected	: {
		method	: ['wtf'],
		property: ['age'],
		event	: ['CC', 'FF'],
		invoker	: ['CC']
	},
	friendly	: {
		method	: ['fight'],
		event	: ['DD', 'EE'],
		invoker	: ['EE', 'BB']
	}
};

var man = create(classPerson, 'Man');
var obj = create(classObject, man);

console.log('===============');
console.log('Function: isAlive, aged');
console.log('Property: name');
console.log('---------------');
console.log(man);
console.log('...............');

console.log('===============');
console.log('Should Be: Man');
console.log('---------------');
console.log(man.name);
console.log('...............');

console.log('===============');
console.log('Should Be: true');
console.log('---------------');
console.log(man.isAlive());
man.aged();
console.log('...............');

console.log('===============');
console.log('Should Be: true');
console.log('---------------');
console.log(man.isAlive());
man.aged();
console.log('...............');

console.log('===============');
console.log('Should Be: true');
console.log('---------------');
console.log(man.isAlive());
man.aged();
console.log('...............');

console.log('===============');
console.log('Should Be: true');
console.log('---------------');
console.log(man.isAlive());
man.aged();
console.log('...............');

console.log('===============');
console.log('Should Be: true');
console.log('---------------');
console.log(man.isAlive());
man.aged();
console.log('...............');

console.log('===============');
console.log('Should Be: true');
console.log('---------------');
console.log(man.isAlive());
man.aged();
console.log('...............');

console.log('===============');
console.log('Should Be: false');
console.log('---------------');
console.log(man.isAlive());
man.aged();
console.log('...............');

console.log('===============');
console.log('Should Be: false');
console.log('---------------');
console.log(man.isAlive());
man.aged();
console.log('...............');

console.log('===============');
console.log('Should Be: false');
console.log('---------------');
console.log(man.isAlive());
man.aged();
console.log('...............');

console.log('===============');
console.log('Should Be: false');
console.log('---------------');
console.log(man.isAlive());
man.aged();
console.log('...............');

console.log('===============');
console.log('Should Be: false');
console.log('---------------');
console.log(man.isAlive());
console.log('...............');

obj.test();
man.test(man);

var interface = new Interface({
	method	: ['isAlive'],
	property: ['name']
});
var del = man.interface(interface);
console.log(del);
console.log(del.isAlive());
console.log(del.name);

console.log('{{{{{{{{{{{{{{{{{{{{{{');
man.on('AA', function () {console.log('Event AA Fired!');});
man.on('BB', function () {console.log('Event AA Fired!');});

man.fire('AA');
man.fire('BB');
man.fire('CC');

/*
{
	public		: {
		event	: ['AA', 'BB'],
		invoker	: ['AA', 'CC']
	},
	protected	: {
		event	: ['CC', 'FF'],
		invoker	: ['CC']
	},
	friendly	: {
		event	: ['DD', 'EE'],
		invoker	: ['EE', 'BB']
	}
};
*/