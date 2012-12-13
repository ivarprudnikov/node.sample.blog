var mongoose = require("mongoose")
    , GridStore = mongoose.mongo.GridStore
    , ObjectID = mongoose.mongo.BSONPure.ObjectID;

exports.get = function(id, fn) {
    var db, store;
    db = mongoose.connection.db;
    id = new ObjectID(id);
    store = new GridStore(db, id, "r", {
        root: "fs"
    });
    return store.open(function(err, store) {
        if (err) {
            return fn(err);
        }
        if (("" + store.filename) === ("" + store.fileId) && store.metadata && store.metadata.filename) {
            store.filename = store.metadata.filename;
        }
        return fn(null, store);
    });
};

exports.delete = function(id, fn) {
    var db, store;
    db = mongoose.connection.db;
    id = new ObjectID(id);
    store = new GridStore(db, id, "r", {
        root: "fs"
    });
    return store.unlink(function(err, result) {
        if (err) {
            return fn(err);
        }
        return fn(null, result);
    });
};

exports.put = function(path, name, options, fn) {
    var db;
    db = mongoose.connection.db;
    options.metadata = options.metadata || {};
    options.metadata.filename = name;
    return new GridStore(db, name, "w", options).open(function(err, file) {
        if (err) {
            return fn(err);
        }
        return file.writeFile(path, fn);
    });
};