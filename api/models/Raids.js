/**
* Raids.js
*
* @description :: A model definition represents a database table/collection.
* @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
*/

module.exports = {
    dontUseObjectIds: true,
    attributes: {
        guildId: {
            type: 'string',
            required: true
        },
        channelId: {
            type: 'string',
            required: true
        },
        signupMessageId: {
            type: 'string',
            required: true
        },
        rosterMessageId: {
            type: 'string',
            defaultsTo: ""
        },
        roleId: {
            type: 'string',
            defaultsTo: ""
        },
        authorId: {
            type: 'string',
            required: true
        },
        title: {
            type: 'string',
            required: true
        },
        active: {
            type: 'boolean',
            defaultsTo: true
        },
        startsAt: {
            type: 'string',
            required: true
        }
    },

    beforeCreate: ((obj, cb) => {
        Sequence.next('raids', (error, number) => {
            if (error) return cb(error);
            obj.id = number;
            cb();
        });
    })
};
