module.exports = {
    attributes: {
        seq: { type: 'number' }
    },

    next: ((id, cb) => {
        let db = Sequence.getDatastore().manager;
        let collection = db.collection('sequence');

        collection.findAndModify(
            { _id: id },
            [[ '_id', 'asc' ]],
            { $inc: { seq : 1 }},
            { new: true, upsert : true },
            (err, data) => cb(err, data.value.seq)
        );
    })
}
