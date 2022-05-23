const { startCollection } = require('../helpers/functions');
const moment = require('moment-timezone');
module.exports = {
    name: 'makeraid',
    aliases: ['mr'],
    permissions: ["MANAGE_MESSAGES"],
    description: 'Makes a new raid',
    async execute(client, message, Discord, args) {
        startCollection([
            ["Enter a title", "string"],
            ["Enter a start date (format: " + moment().format('L LT') + ")", "date"]
        ], message.author, Discord).then(data => {
            Guilds.findOne({ guildId: message.guild.id })
                .then(async guild => {
                    let timezone = moment.tz(guild.timezone).format(' z');
                    let timestamp = data[1].content.split(" ");

                    // Create embed message
                    const embed = new Discord.MessageEmbed()
                        .setAuthor("Raid Signup")
                    	.setTitle(data[0].content)
                    	.addFields(
                    		{ name: client.emojis.cache.get('823343415454466068').toString() + ' ' + timestamp[0], value: '\u200B', inline: true }, // Date
                            { name: client.emojis.cache.get('823343452573794304').toString() + ' ' + timestamp[1] + " " + timestamp[2] + timezone, value: '\u200B', inline: true }, // Time
                            { name: client.emojis.cache.get('823343483589886013').toString() + ' 0', value: '\u200B', inline: true }, // Count
                    	)

                    // Send signup message
                    let messageEmbed = await message.channel.send(embed);

                    // Class reactions
                    messageEmbed.react(client.emojis.cache.get('822678417551130644'));
                    messageEmbed.react(client.emojis.cache.get('822678044921561099'));
                    messageEmbed.react(client.emojis.cache.get('822678074931412992'));
                    messageEmbed.react(client.emojis.cache.get('822678996399423499'));
                    messageEmbed.react(client.emojis.cache.get('822678941269229598'));
                    //messageEmbed.react(client.emojis.cache.get('822678092983697438'));
                    messageEmbed.react(client.emojis.cache.get('822678110948032562'));
                    messageEmbed.react(client.emojis.cache.get('822678908511453185'));
                    messageEmbed.react(client.emojis.cache.get('822678131822428180'));
                    messageEmbed.react(client.emojis.cache.get('822678160029777931'));
                    messageEmbed.react(client.emojis.cache.get('822678175170560060'));
                    messageEmbed.react(client.emojis.cache.get('822679201056423946'));
                    messageEmbed.react(client.emojis.cache.get('822679236854153226'));
                    messageEmbed.react(client.emojis.cache.get('822679267434954752'));

                    // Intent reactions
                    messageEmbed.react(client.emojis.cache.get('824908627226787863'));
                    messageEmbed.react(client.emojis.cache.get('824908594162958348'));
                    messageEmbed.react(client.emojis.cache.get('824885895810383872'));

                    // Control reactions
                    messageEmbed.react(client.emojis.cache.get('822983649367425065'));
                    messageEmbed.react(client.emojis.cache.get('823343452573794304'));

                    // Store raid in database
                    Raids.create({
                        signupMessageId: messageEmbed.id,
                        guildId: message.guild.id,
                        channelId: message.channel.id,
                        authorId: message.author.id,
                        title: data[0].content,
                        startsAt: moment.tz(new Date(data[1].content + timezone).toUTCString(), "Atlantic/Azores").format('YYYY-MM-DD HH:mm:ss')
                    }).fetch()
                        .then(async raid => {
                            messageEmbed.embeds[0].setFooter('Raid Id: ' + raid.id + " • Signups Status: 🟢" + "\u200B ".repeat(100));
                            messageEmbed.embeds[0].setDescription('[Commands](https://raidassist.me/commands) | [Manage Raid](https://raidassist.me/raids/' + raid.id + ')');
                            await messageEmbed.edit(messageEmbed.embeds[0]);
                            message.author.send('```Raid successfully created!``` ***Posted in*** <#' + message.channel + '>');
                        })
                        .catch(error => {
                            message.author.send('```I was unable to create your raid. Please try again.```');
                        });
                });
        });
    }
}
