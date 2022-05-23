const Discord = require('discord.js');
const client = sails.hooks.discord.client;

module.exports = {
    friendlyName: 'Close Signups',
    description: 'Closes the signups on a raid and removes all reactions',

    inputs: {
        channelId: {
            description: 'Channel ID of raid',
            type: 'string',
            required: true
        },
        signupMessageId: {
            description: 'Signup Message ID of raid',
            type: 'string',
            required: true
        }
    },

    exits: {
        success: {
          outputFriendlyName: 'Success'
        },
    },

    fn: async function (inputs, exits) {
        let channel = await client.channels.fetch(inputs.channelId);
        let signupMessage = await channel.messages.fetch(inputs.signupMessageId);

        // Set signup status red
        let newFooter = signupMessage.embeds[0].footer.text.replace("🟢", "🔴");
        signupMessage.embeds[0].setFooter(newFooter);

        // Edit message
        await signupMessage.edit(signupMessage.embeds[0]);

        // Remove all reactions
        await signupMessage.reactions.removeAll();

        return exits.success();
    }
};
