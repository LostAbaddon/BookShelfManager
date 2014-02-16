const EventMgr	= require('../eventManager');

const eventalize	= EventMgr.eventalize;

var obj = {};
eventalize(obj);

function CB () {
	console.log('Hook B');
};
obj.on('msg', function () {
	console.log('Hook A');
});
obj.on('msg', CB);
obj.on('msg', function () {
	console.log('Hook C');
});
obj.once('msg', function () {
	console.log('Once Hook');
});

obj.fire('msg');
obj.fire('msg');
obj.fire('msg');
obj.off('msg', CB);
obj.fire('msg');

obj.on('click', function (x, y) {
	console.log('Click At: ' + x + ', ' + y);
});
obj.on('click', function (x, y) {
	console.log('Mouse Down And Up At: ' + x + ', ' + y);
});

obj.fire('click', 100, 200);