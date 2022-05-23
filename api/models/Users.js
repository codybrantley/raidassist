/**
* User.js
*
* @description :: A model definition represents a database table/collection.
* @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
*/

module.exports = {
    attributes: {
        discordId: {
            type: 'string',
            required: true
        },
        username: {
            type: 'string',
            defaultsTo: ''
        },
        discriminator: {
            type: 'string',
            defaultsTo: ''
        },
        avatar: {
            type: 'string',
            defaultsTo: ''
        },
        guilds: {
            type: 'json',
            defaultsTo: ''
        },
        refreshToken: {
            type: 'string',
            defaultsTo: ''
        },
        timezone: {
            type: 'string',
            defaultsTo: ''
        }
    }
};
