const Discord = require('discord.js');
const client = sails.hooks.discord.client;

module.exports = {
    friendlyName: 'Open Signups',
    description: 'Reopens the signups on a raid and adds back all reactions',

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
        let newFooter = signupMessage.embeds[0].footer.text.replace("🔴", "🟢");
        signupMessage.embeds[0].setFooter(newFooter);

        // Edit message
        await signupMessage.edit(signupMessage.embeds[0]);

        // Add back reactions

        // Class reactions
        signupMessage.react(client.emojis.cache.get('822678417551130644'));
        signupMessage.react(client.emojis.cache.get('822678044921561099'));
        signupMessage.react(client.emojis.cache.get('822678074931412992'));
        signupMessage.react(client.emojis.cache.get('822678996399423499'));
        signupMessage.react(client.emojis.cache.get('822678941269229598'));
        //messageEmbed.react(client.emojis.cache.get('822678092983697438'));
        signupMessage.react(client.emojis.cache.get('822678110948032562'));
        signupMessage.react(client.emojis.cache.get('822678908511453185'));
        signupMessage.react(client.emojis.cache.get('822678131822428180'));
        signupMessage.react(client.emojis.cache.get('822678160029777931'));
        signupMessage.react(client.emojis.cache.get('822678175170560060'));
        signupMessage.react(client.emojis.cache.get('822679201056423946'));
        signupMessage.react(client.emojis.cache.get('822679236854153226'));
        signupMessage.react(client.emojis.cache.get('822679267434954752'));

        // Intent reactions
        signupMessage.react(client.emojis.cache.get('824908627226787863'));
        signupMessage.react(client.emojis.cache.get('824908594162958348'));
        signupMessage.react(client.emojis.cache.get('824885895810383872'));

        // Control reactions
        signupMessage.react(client.emojis.cache.get('822983649367425065'));
        signupMessage.react(client.emojis.cache.get('823343452573794304'));

        return exits.success();
    }
};
