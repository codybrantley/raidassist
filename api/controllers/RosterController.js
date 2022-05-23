/**
 * RosterController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const Discord = require('discord.js');
const client = sails.hooks.discord.client;

module.exports = {
    closeSignups: (req, res) => {
        Raids.updateOne({ _id: req.body.raidId }).set({ active: false })
            .then(async raid => {
                await sails.helpers.closeSignups(raid.channelId, raid.signupMessageId);
            });

        res.sendStatus(200);
    },

    reopenSignups: (req, res) => {
        Raids.updateOne({ _id: req.body.raidId }).set({ active: true })
            .then(async raid => {
                await sails.helpers.openSignups(raid.channelId, raid.signupMessageId);
            });

        res.sendStatus(200);
    },

    save: async (req, res) => {
        let raid = await Raids.findOne({ _id: req.body.raidId });

        let guild = [];
        if (raid.rosterMessageId !== "") { guild = await client.guilds.fetch(raid.guildId) };

        await Promise.all(req.body.members.map(async item => {
            await Signups.updateOne({ userId: item.userId, raidId: raid.id }).set({ member: true })
                .then(async signup => {
                    if (raid.rosterMessageId !== "") {
                        await guild.members.fetch(signup.userId)
                            .then(member => {
                                member.roles.add(raid.roleId);
                            })
                            .catch(error => { console.log(error); });
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }));

        res.sendStatus(200);
    },

    remove: async (req, res) => {
        let raid = await Raids.findOne({ _id: req.body.raidId });
        let guild = await client.guilds.fetch(raid.guildId);

        await Promise.all(req.body.members.map(async item => {
            await Signups.updateOne({ userId: item.userId, raidId: raid.id }).set({ member: false, confirmed: false, rejected: false, rosterValue: "" })
                .then(async signup => {
                    if (raid.rosterMessageId !== "") {
                        await guild.members.fetch(signup.userId)
                            .then(member => {
                                member.roles.remove(raid.roleId);
                            })
                            .catch(error => { console.log(error); });
                    }
                })
                .catch(error => {
                    res.sendStatus(500);
                });
        }));

        res.sendStatus(200);
    },

    publish: (req, res) => {
        Raids.findOne({ _id: req.body.raidId })
            .then(async raid => {
                let guild = await client.guilds.fetch(raid.guildId);
                let channel = await client.channels.fetch(raid.channelId);
                let message = await channel.messages.fetch(raid.signupMessageId);

                Signups.find({ raidId: raid.id })
                    .then(async data => {
                        let [signups, members] = await sails.helpers.sortSignups(data);

                        const embed = new Discord.MessageEmbed()
                            .setAuthor("Raid Roster")
                        	.setTitle(raid.title);

                        const role = await guild.roles.create({
                            data: {
                                name: 'Raid #' + raid.id,
                                color: 'DARK_GREY',
                                permissions: 0,
                                mentionable: true
                            },
                            reason: 'Roster members for Raid #' + raid.id,
                        });

                        function contentsToString(contents) {
                            let value = "";

                            contents.forEach(async (item, i) => {
                                let rosterValue = item.signupValue + " ○";
                                value += rosterValue + " \n";
                                await Signups.updateOne({ raidId: raid.id, userId: item.userId }, { rosterValue: rosterValue });
                                await guild.members.fetch(item.userId).then(member => { member.roles.add(role.id); });
                            });

                            return value;
                        }

                        members.forEach((item, i) => {
                            let classKey = client.classes.findKey(classObj => classObj.name === item.className);
                            let classEmoji = client.emojis.cache.get(client.classes.get(classKey).emoji).toString();

                            embed.addFields({
                                name: classEmoji + ' __**' + item.className + 's**__',
                                value: contentsToString(item.contents),
                                inline: true
                            });
                        });

                        embed.setFooter('React below to confirm your spot.\nRaid Id: ' + raid.id + "\u200B ".repeat(100));

                        let roster = await message.channel.send(embed);
                        roster.react(client.emojis.cache.get("835975635796099073"));
                        roster.react(client.emojis.cache.get("835977128372994058"));

                        await Raids.updateOne({ _id: raid.id }, { rosterMessageId: roster.id, roleId: role.id });

                        res.sendStatus(200);
                    });
            });
    },

    update: (req, res) => {
        Raids.findOne({ _id: req.body.raidId })
            .then(async raid => {
                let guild = await client.guilds.fetch(raid.guildId);
                let channel = await client.channels.fetch(raid.channelId);
                let message = await channel.messages.fetch(raid.rosterMessageId);
                let embed = message.embeds[0];

                Signups.find({ raidId: raid.id })
                    .then(async data => {
                        let [signups, members] = await sails.helpers.sortSignups(data);
                        embed.spliceFields(0, 25);

                        function contentsToString(contents) {
                            let value = "";

                            contents.forEach(async (item, i) => {
                                if(item.rosterValue) {
                                    value += item.rosterValue + " \n";
                                } else {
                                    value += item.signupValue + " ○ \n";
                                    await Signups.updateOne({ raidId: raid.id, userId: item.userId }, { rosterValue: item.signupValue + " ○" });
                                    await guild.members.fetch(item.userId).then(member => { member.roles.add(raid.roleId); });
                                }
                            });

                            return value;
                        }

                        members.forEach((item, i) => {
                            let classKey = client.classes.findKey(classObj => classObj.name === item.className);
                            let classEmoji = client.emojis.cache.get(client.classes.get(classKey).emoji).toString();

                            embed.addFields({
                                name: classEmoji + ' __**' + item.className + 's**__',
                                value: contentsToString(item.contents),
                                inline: true
                            });
                        });

                        await message.edit(embed);

                        res.sendStatus(200);
                    });
            });
    }
};
