const ClassMgr	= require('../classManager');

const create	= ClassMgr.create;

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
	console.log('Protected:');
	console.log(this.delegate.getExtendInstance(test));
	console.log(this.delegate.getExtendInstance(test).wtf());
};

function classObject (Person) {
	this.id = this.total++;
	this.person = Person;
}
classObject.prototype.type	= 'Class Object';
classObject.prototype.total	= 0;
classObject.prototype.test = function () {
	console.log('Friendly:');
	console.log(this.delegate.getExtendInstance(this.person));
};

classPerson.structure = {
	ally		: [classObject],
	public		: {
		method	: ['isAlive', 'aged', 'test'],
		property: ['name']
	},
	protected	: {
		method	: ['wtf'],
		property: ['age']
	},
	friendly	: {
		method	: ['fight']
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