
const admin = require("firebase-admin");

const serviceAccount = require(`../databaseAuthentication.json`);
const databaseHandler = require("../databaseHandler");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

const database = admin.firestore();

exports.getDatabase = () => {
	return database
}


exports.getData = async (_path, createIfNotExists= false) => {
	_path = cleanPath(_path)
	let _data = databaseHandler.createFromArray(createIfNotExists, _path);
	let firebaseData = await firebaseGet(_path, createIfNotExists)
	if (firebaseData.originalData) {
		return firebaseData.originalData
	}
	if (!firebaseData.originalData && _data.frArray) {
		return firebaseData[_data.defaultName]
	}
	return firebaseData
}

exports.addData = async (_path, _data={}) => {
	if (_data === true) {
		_data = {};
	}
	
	_path = cleanPath(_path)
	_data = databaseHandler.createFromArray(_data, _path);
	await firebaseAdd(_path, _data.data)
	return _data
}

firebaseAdd = (_path, data) => {
	let path = database.doc(_path)
	return new Promise((resolve) => {
		path.set(data, {
			merge: true
		}).then(doc => {
			resolve(doc);
		})
	});
}

firebaseGet = (_path, createIfNotExists) => {
	let path = database.doc(_path)
	return path.get().then(doc => {
		if (doc.exists) {
			return doc.data();
		} else if (createIfNotExists) {
			return this.addData(_path, createIfNotExists)
		}
	});
}

const cleanPath = (_path) => {
	_path = _path.replace(/\\/g, '/')
	if (_path.startsWith('.')) {
		_path = _path.substr(1);
	}
	return _path
}