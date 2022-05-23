const { startCollection } = require('../helpers/functions');
module.exports = {
    name: 'timezone',
    permissions: ["ADMINISTRATOR"],
    description: 'Allows an admin to change the global timezone for raid dates',
    async execute(client, message, Discord, args) {
        startCollection([
            ["Enter your timezone", "option", client.timezones.map(time => time.name)]
        ], message.author, Discord)
            .then(data => {
                Guilds.updateOne({ guildId: message.guild.id }, { timezone: client.timezones.get(parseInt(data[0].content)).zone })
                    .then(() => {
                        message.author.send("Timezone successfully updated.");
                    })
                    .catch(error => {
                        message.author.send('```Unable to update. Please try again.```');
                    });
            });
    }
}
