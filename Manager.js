/*
 * Read and Collect the Shelf Folder
 */

const current_path = __dirname + '\\';
const type_length_max = 4;
const block_list = ['ini', 'js', 'vbs', 'xml', 'css', 'loaded0', '1', 'dropbox', 'dll', 'bak', 'save', 'in', 'php', 'm', 'srt', 'conf', 'bug', 'faq', 'sh', 'ftp', 'log', 'cls', 'bas', 'url', 'class', 'com', 'lock', 'location', 'ocx', 'bat', 'cfg', 'bin', 'res', 'vb', 'sln', 'ctx', 'cs', 'ctl', 'user', 'suo', 'inf', 'java', 'vbp', 'vbw', 'frm', 'scc', 'frx', 'ico'];
const black_list = ['cal_', 'pl@', 'data', 'id_', 'jc', '3dp', 'proj', 'symmetry'];
const black_length = black_list.length;
const ignore_list = ['cache', '_files', 'Calculate Lie Algebra', 'My Shop', 'icons', 'images', 'SQ'];
const ignore_length = ignore_list.length;

var fs = require('fs');

var file_list = {};
var type_list = {};

function analyze_file (file_name) {
	var pos = file_name.lastIndexOf('.'), name, type, i;
	if (pos < 0) return '';
	type = file_name.substr(pos + 1).toLowerCase();
	if (type.length > type_length_max) return '';
	if (block_list.indexOf(type) >= 0) return '';
	for (i = 0; i < black_length; i++) {
		if (type.indexOf(black_list[i]) >= 0) return '';
	}
	name = file_name.substr(0, pos).toLowerCase();
	if (parseInt(name, 10) + '' !== name) {
		file_list[name] = file_list[name] || 0;
		file_list[name]++;
		
		type_list[type] = type_list[type] || 0;
		type_list[type]++;
	}
	return '<file>' + file_name.replace(/&/gi, '&amp;') + '</file>\n';
}

function read_folder (path, name) {
	console.log('Analyzing ' + path + ' ...');
	var folders = fs.readdirSync(path), l = folders.length, i, j, file_name, result = '', total = 0;
	for (i = 0; i < l; i++) {
		file_name = path + folders[i];
		if (fs.statSync(file_name).isFile()) {
			j = analyze_file(folders[i]);
			if (j !== '') {
				result += analyze_file(folders[i]);
				total++;
			}
		}
	}
	for (i = 0; i < l; i++) {
		file_name = path + folders[i];
		if (!fs.statSync(file_name).isFile()) {
			for (j = 0; j < ignore_length; j++) {
				if (folders[i].indexOf(ignore_list[j]) >= 0) break;
			}
			if (j === ignore_length) {
				j = read_folder(file_name + '\\', folders[i]);
				result += j[0];
				total += j[1];
			}
		}
	}
	if (total === 0) return ['', 0];
	result = '<folder name="' + name.replace(/&/gi, '&amp;') + '" count="' + total + '">\n' + result;
	result += '</folder>\n';
	return [result, total];
}

var result = read_folder(current_path, 'ROOT');

console.log('Total Files: ' + result[1]);
/*
result[0] += '<StaticResults>\n';

result[0] += '<RepeatFiles>\n';
var item;
for (item in file_list) {
	if (file_list[item] > 1) {
		result[0] += '<FileItem>\n';
		result[0] += '<Name>' + item.replace(/&/gi, '&amp;') + '</Name>\n';
		result[0] += '<Count>' + file_list[item] + '</Count>\n';
		result[0] += '</FileItem>\n';
	}
}
result[0] += '</RepeatFiles>\n';

result[0] += '<FileType>\n';
for (item in type_list) {
	if (type_list[item] > 5) {
		result[0] += '<Type>\n';
		result[0] += '<Name>' + item.replace(/&/gi, '&amp;') + '</Name>\n';
		result[0] += '<Count>' + type_list[item] + '</Count>\n';
		result[0] += '</Type>\n';
	}
}
result[0] += '</FileType>\n';

result[0] += '</StaticResults>\n';
*/

result[0] = '<BookShelf>\n' + result[0] + '</BookShelf>';

fs.writeFileSync(current_path + 'Manager.xml', result[0]);