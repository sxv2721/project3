const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let NoteModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const NoteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        set: setName,
    },
    note: {
        type: String,
        required: true,
        trim: true,
        set: setName,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    revealDate: {
        type:Date,
        default: Date.now,
    },
    createdData: {
        type: Date,
        default: Date.now,
    },
});

NoteSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    note: doc.note,
    reveal: doc.revealDate,
});

NoteSchema.statics.findByOwner = (ownerId, callback) => {
    const search = {
        owner: convertId(ownerId),
    };
    
    return NoteModel.find(search).select('name').exec(callback);
};

NoteModel = mongoose.model('Note', NoteSchema);

module.exports.NoteModel = NoteModel;
module.exports.NoteSchema = NoteSchema;