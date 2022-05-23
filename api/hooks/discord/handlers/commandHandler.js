const fs = require('fs');

module.exports = async (client, Discord) => {
    const commandFiles = fs.readdirSync('./api/hooks/discord/commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        if (command.name) {
            client.commands.set(command.name, command);
        } else {
            continue;
        }
    }
}
