
const admin = require("firebase-admin");

const serviceAccount = require(`../../config/keys/databaseAuthentication.json`);
const databaseHandler = require("../databaseHandler");

try {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
	});
} catch (e) {
	console.log(e)
}


const database = admin.firestore();

exports.getDatabase = () => {
	return database
}


exports.getData = async (_path, createIfNotExists= false) => {
	_path = cleanPath(_path)
	let _data = databaseHandler.createFromArray(createIfNotExists, _path);
	let firebaseData
	if (_path.split('/').length % 2 !== 0) {
		firebaseData = await firebaseDocGet(_path, createIfNotExists)
	} else {
		firebaseData = await firebaseColGet(_path, false)
	}
	
	if (firebaseData && firebaseData.originalData) {
		return firebaseData.originalData
	}
	if (firebaseData && !firebaseData.originalData && _data.frArray) {
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
	if (_path.split('/').length % 2 !== 0) {
		await firebaseDocAdd(_path, _data.data)
	} else {
		await firebaseColAdd(_path, _data.data)
	}
	
	return _data
}

firebaseDocAdd = (_path, data) => {
	let path = database.doc(_path)
	return new Promise((resolve) => {
		path.set(data, {
			merge: true
		}).then(doc => {
			resolve(doc);
		})
	});
}

firebaseDocGet = (_path, createIfNotExists) => {
	let path = database.doc(_path)
	return path.get().then(doc => {
		if (doc.exists) {
			return doc.data();
		} else if (createIfNotExists) {
			return this.addData(_path, createIfNotExists)
		}
	});
}

firebaseColAdd = (_path, data) => {
	let path = database.collection(_path)
	return new Promise((resolve) => {
		path.set(data, {
			merge: true
		}).then(doc => {
			resolve(doc);
		})
	});
}

firebaseColGet = (_path, createIfNotExists) => {
	let path = database.collection(_path)
	return path.get().then(doc => {
		if (doc) {
			return doc.docs
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