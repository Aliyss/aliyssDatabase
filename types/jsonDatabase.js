const fs = require('fs')
const path = require('path');

const databaseHandler = require('../databaseHandler')

exports.getData = async (_path, createIfNotExists= false) => {
	_path = cleanPath(_path)
	let _data = databaseHandler.createFromArray(createIfNotExists, _path);
	try {
		return require(_path)
	} catch (e) {
		if (createIfNotExists) {
			let jsonData = await this.addData(_path, createIfNotExists)
			return jsonData.originalData
		}
	}
}

exports.addData = async (_path, _data={}) => {
	if (_data === true) {
		_data = {};
	}
	
	// Does not handle merge
	await this.addPath(path.dirname(_path))
	_path = cleanPath(_path)
	_data = databaseHandler.createFromArray(_data, _path.replace(/\\/g, '/'));
	
	await fs.writeFile(_path, JSON.stringify(_data.data, null, 4), function (err) {
		if (err) throw err;
		console.log(`[Database] File saved: ${_path}`);
	});
	
	return _data
}

exports.addPath = async (_path, recursive= true) => {
	if (!fs.existsSync(_path)){
		fs.mkdirSync(_path, { recursive: recursive });
	}
}

const cleanPath = (_path) => {
	if (!_path.endsWith(".json")) {
		_path += ".json"
	}
	return _path
}