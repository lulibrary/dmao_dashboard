// input - array of objects
// output - 'data' hash containing array of objects
function toDataTablesFormat(data) {
	hash = {};
	hash['data'] = data;
	return hash;
}