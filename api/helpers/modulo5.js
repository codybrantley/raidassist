
module.exports = {
    friendlyName: 'Modulo Calculation',
    description: '',
    sync: true,

    inputs: {
        dividend: {
            type: 'number',
            required: true
        },
        divisor: {
            type: 'number',
            defaultsTo: 5
        }
    },

    exits: {
        success: {
          outputFriendlyName: 'Result'
        },
    },

    fn: function (inputs, exits) {
        let modulo = inputs.dividend - (inputs.divisor * Math.round(inputs.dividend / inputs.divisor));
        return exits.success(modulo);
    }
};
