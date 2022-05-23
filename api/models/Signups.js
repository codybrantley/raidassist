/**
* Signups.js
*
* @description :: A model definition represents a database table/collection.
* @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
*/

module.exports = {
    attributes: {
        userId: {
            type: 'string',
            required: true
        },
        raidId: {
            type: 'string',
            required: true
        },
        signupValue: {
            type: 'string',
            required: true
        },
        rosterValue: {
            type: 'string',
            defaultsTo: ""
        },
        member: {
            type: 'boolean',
            defaultsTo: false
        },
        confirmed: {
            type: 'boolean',
            defaultsTo: false
        },
        rejected: {
            type: 'boolean',
            defaultsTo: false
        }
    }
};
