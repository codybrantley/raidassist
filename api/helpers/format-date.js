const moment = require("moment-timezone");
module.exports = {
    friendlyName: 'Format Date',
    description: 'Formats an inputted date to a more readable text',
    sync: true,

    inputs: {
        date: {
            description: 'The date to format',
            type: 'string',
            required: true
        },
        timezone: {
            description: 'The timezone of the client',
            type: 'string',
            required: false,
            defaultsTo: 'Atlantic/Azores'
        },
    },

    exits: {
        success: {
          outputFriendlyName: 'Formatted date'
        },
    },

    fn: function (inputs, exits) {
        let formattedDate = moment.tz(inputs.date, inputs.timezone).format('L hh:ss A z');
        return exits.success(formattedDate);
    }
};
