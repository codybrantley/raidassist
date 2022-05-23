/**
* Guilds.js
*
* @description :: A model definition represents a database table/collection.
* @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
*/

module.exports = {
    attributes: {
        guildId: {
            type: 'string',
            required: true
        },
        ownerId: {
            type: 'string',
            required: true
        },
        timezone: {
            type: 'string',
            defaultsTo: "Atlantic/Azores"
        }
    }
};
