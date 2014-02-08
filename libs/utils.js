var isNull = exports.isNull = function (obj) {
	if (obj === undefined) return true;
	if (obj === null) return true;
	return false;
};

const bra = '(';
const ket = ')';
String.prototype.toJSON = function () {
	return eval(bra + this + ket);
};