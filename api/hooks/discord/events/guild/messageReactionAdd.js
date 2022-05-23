const { executeCommand, startCollection, formatName, formatNumber } = require('../../helpers/functions');
const moment = require('moment-timezone');
module.exports = async (client, Discord, reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;
    if (!reaction.message.guild) return;
    if (!reaction.message.author.bot) return;
    if (!reaction.message.embeds[0]) return;

    let embed = reaction.message.embeds[0];
    let raidId = parseInt(embed.footer.text.match(/[0-9]{1,}/)[0]);

    /**
     * Raid Signup
     */
    if (embed.author.name == "Raid Signup") {
        let currentDate = moment.tz("Atlantic/Azores");
        let raidTimeField = embed.fields[1].name;
        let raidTime = raidTimeField.replace(embed.fields[1].name.split(" ")[0], "");
        let raidDateString = embed.fields[0].name.split(" ")[1] + raidTime;
        let raidDate = moment.tz(new Date(raidDateString).toUTCString(), "Atlantic/Azores");
        let raidCount = parseInt(embed.fields[2].name.split(" ")[1]);

        if(currentDate > raidDate) return;

        switch (reaction.emoji.name) {
            case "Start_Time":
                executeCommand(client.commands.get("converttime"), client, user, Discord, reaction, raidDateString);
                break;
            case "Unregister":
                Signups.destroy({ userId: user.id, raidId: raidId }).fetch()
                    .then(signup => {
                        if (signup) {
                            let match = false;
                            embed.fields.forEach((item, i) => {
                                if (item.value.includes(signup.signupValue)) {
                                    match = i;
                                }
                            });

                            if (match) {
                                let value = embed.fields[match].value.replace(signup.signupValue, "");
                                let newMsg = embed;

                                if (value.trim()) {
                                    newMsg.spliceFields(match, 1, {
                                        name: embed.fields[match].name,
                                        value: embed.fields[match].value.replace(signup.signupValue, ''),
                                        inline: true
                                    });
                                } else {
                                    newMsg.spliceFields(match, 1);
                                }

                                newMsg.spliceFields(2, 1, {
                                    name: client.emojis.cache.get('823343483589886013').toString() + ' ' + (raidCount-1),
                                    value: '\u200B', inline: true
                                });

                                reaction.message.edit(newMsg);
                            }
                        }
                    });
                break;
            case "Buyer":
            case "Semi_Carry":
            case "Hard_Carry":
                Signups.findOne({ userId: user.id, raidId: raidId })
                    .then(async signup => {
                        if (signup) {
                            let match = false;
                            embed.fields.forEach((item, i) => {
                                if (item.value.includes(signup.signupValue)) {
                                    match = i;
                                }
                            });

                            if (match) {
                                let intentEmoji = client.emojis.cache.get(client.intents.find(intent => intent.name == reaction.emoji.name).emoji).toString();
                                let originalEmoji = client.emojis.cache.get(client.intents.get(4).emoji).toString();
                                let newSignupValue = signup.signupValue.replace(originalEmoji, intentEmoji);
                                let newValue = embed.fields[match].value.replace(signup.signupValue, newSignupValue);

                                Signups.updateOne({ userId: user.id, raidId: raidId }, { signupValue: newSignupValue })
                                    .then(() => {
                                        let newMsg = embed.spliceFields(match, 1, {
                                            name: embed.fields[match].name,
                                            value: newValue,
                                            inline: true
                                        });

                                        reaction.message.edit(newMsg);
                                    });
                            }
                        }
                    });
                break;
            default:
                Signups.findOne({ userId: user.id, raidId: raidId })
                    .then(async signup => {
                        //if (!signup) {
                            let classKey = client.classes.findKey(classObj => classObj.name === reaction.emoji.name);
                            let selectedClass = client.classes.get(classKey);
                            let className;
                            let classEmoji;
                            let specEmoji;

                            if (reaction.emoji.name.includes("_")) {
                                let split = reaction.emoji.name.split("_");
                                className = split[1];
                                classEmoji = client.emojis.cache.get(client.classes.get(selectedClass.ref).emoji).toString();
                                specEmoji = client.emojis.cache.get(selectedClass.emoji).toString();
                            } else {
                                className = reaction.emoji.name;
                                classEmoji = client.emojis.cache.get(selectedClass.emoji).toString();
                                specEmoji = client.emojis.cache.get(selectedClass.emoji).toString();
                            }

                            Signups.find({ where: { raidId: raidId }, sort: 'createdAt DESC', limit: 1 })
                                .then((result) => {
                                    let signupNumber;
                                    if (result.length > 0) {
                                        let number = parseInt(result[0].signupValue.match(/`[0-9]{2,}`/)[0].replace('`', ''));
                                        signupNumber = formatNumber(number+1);
                                    } else {
                                        signupNumber = "01";
                                    }

                                    let characterName = user.username;
                                    let intentEmoji = client.emojis.cache.get(client.intents.get(4).emoji).toString();
                                    let match = false;
                                    embed.fields.forEach((item, i) => {
                                        let string = item.name.split(" ")[1].match(/([A-Za-z]){4,}/);
                                        if (string) {
                                            let itemName = string[0].slice(0, string[0].length - 1);
                                            if (itemName.includes(className)) {
                                                match = i;
                                            }
                                        }
                                    });

                                    let newValue = specEmoji + intentEmoji + '`' + signupNumber + '` ' + characterName;
                                    let newMsg = embed;

                                    // If class list already exists add character to it
                                    if (match) {
                                        newMsg.spliceFields(match, 1, {
                                            name: classEmoji + ' __**' + className + 's**__',
                                            value: embed.fields[match].value + "\n" + newValue,
                                            inline: true
                                        });
                                    }
                                    // Otherwise, create it
                                    else {
                                        newMsg.addFields({
                                            name: classEmoji + ' __**' + className + 's**__',
                                            value: newValue,
                                            inline: true
                                        });
                                    }

                                    newMsg.spliceFields(2, 1, {
                                        name: client.emojis.cache.get('823343483589886013').toString() + ' ' + (raidCount+1),
                                        value: '\u200B', inline: true
                                    });

                                    reaction.message.edit(newMsg);

                                    Signups.create({
                                        userId: user.id,
                                        raidId: raidId,
                                        signupValue: newValue
                                    }).fetch()
                                        .catch(error => {
                                            log.error(error, user.id);
                                        });
                                });
                        //}
                    });
        }
    }

    /**
     * Raid Roster
     */
    if (embed.author.name == "Raid Roster") {
        let selection = (reaction.emoji.name == "Confirm") ? "✓" : (reaction.emoji.name == "Reject") ? "☓" : "";
        if (!selection) return;

        Signups.findOne({ userId: user.id, raidId: raidId })
            .then(async signup => {
                if (signup) {
                    let match = false;
                    embed.fields.forEach((item, i) => {
                        if (item.value.match(signup.rosterValue)) {
                            match = i;
                        }
                    });

                    if (match >= 0) {
                        let newRosterValue = signup.rosterValue.replace("○", selection);
                        let newValue = embed.fields[match].value.replace(signup.rosterValue, newRosterValue);

                        let updateValue = { rosterValue: newRosterValue };
                        if (selection == "✓") {
                            updateValue.confirmed = true;
                        } else if (selection == "☓") {
                            updateValue.rejected = true;
                        }

                        Signups.updateOne({ userId: user.id, raidId: raidId }, updateValue)
                            .then(() => {
                                let newMsg = embed.spliceFields(match, 1, {
                                    name: embed.fields[match].name,
                                    value: newValue,
                                    inline: true
                                });

                                reaction.message.edit(newMsg);
                            });
                    }
                }
            });
    }

    // Remove reaction
    reaction.users.remove(user);
}
