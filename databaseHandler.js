
exports.createFromArray = (_data, _path) => {
	
	if (!Array.isArray(_data)) {
		return {
			frArray: false,
			defaultName: '',
			data: _data,
			originalData: _data
		};
	}
	
	if (_path.endsWith('.json')) {
		_path = _path.substring(0, _path.length - 5);
	}
	
	let arrayName = _path.split('/')[_path.split('/').length - 1]
	
	return {
		frArray: true,
		defaultName: arrayName,
		data: {
			[arrayName]: _data
		},
		originalData: _data
	};
}

exports.retrieveFromArray = (checkData) => {
	return checkData.originalData
}