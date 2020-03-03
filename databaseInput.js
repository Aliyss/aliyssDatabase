const fs = require('fs')
const path = require('path');

exports.configCheck = async (db_init, _configFolder, _configId='instances') => {
	let new_db_init = {}
	
	_configId = "\\" + _configId
	
	if (!db_init) {
		new_db_init = {
			type: 'json',
			init: false,
			cleanPath: ''
		}
	} else {
		new_db_init = {
			type: db_init.type,
			init: db_init.init,
			cleanPath: db_init.cleanPath
		}
	}

	if (!db_init.type) {
		db_init.type = 'json'
	}

	new_db_init.folder = _configFolder + "\\database" + _configId + "\\"

	switch (new_db_init.type) {
		case "firebase":
			if (new_db_init.folder.startsWith(new_db_init.cleanPath)) {
				new_db_init.folder = new_db_init.folder.substring(new_db_init.cleanPath.length)
			}
			break;
		case "json":
		default:
			await this.databaseFull(new_db_init).addPath(new_db_init.folder)
			break;
	}
	
	return new_db_init
}

exports.databaseFull = (db_init) => {
	return require('./types/' + db_init.type + 'Database')
}