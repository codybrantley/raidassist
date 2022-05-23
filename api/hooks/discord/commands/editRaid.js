const { startCollection } = require('../helpers/functions');
const moment = require('moment-timezone');
module.exports = {
    name: 'editraid',
    aliases: ['er'],
    permissions: ["MANAGE_MESSAGES"],
    description: 'Edits a raid',
    async execute(client, message, Discord, args) {
        Raids.findOne({ id: args[0]  })
            .then(raid => {
                message.channel.messages.fetch(raid.signupMessageId)
                    .then(signupMessage => {
                        startCollection([
                            ["What item do you want to edit?", "option", ["Title", "Start Date"]],
                            ["", "selection", [["Enter a new title", "string"],["Enter a start date  (format: " + moment().format('L LT') + ")", "date"]]]
                        ], message.author, Discord).then(async (data) => {
                                let key = parseInt(data[0].content);
                                let embed = signupMessage.embeds[0];

                                // Update embed content based on desired fields
                                switch(key) {
                                    case 1:
                                        embed.setTitle(data[1].content);
                                        break;
                                    case 2:
                                        let dateField = embed.fields[0].name.split(" ");
                                        let timeField = embed.fields[1].name.split(" ");
                                        let timestamp = data[1].content.split(" ");
                                        embed.spliceFields(0, 1, {
                                            name: dateField[0] + " " + timestamp[0], value: '\u200B', inline: true
                                        });
                                        embed.spliceFields(1, 1, {
                                            name: timeField[0] + " " + timestamp[1] + " " + timestamp[2] + " " + timeField[3], value: '\u200B', inline: true
                                        });
                                        break;
                                    default:
                                        return false;
                                        break;
                                }

                                // Edit signup message
                                signupMessage.edit(embed)
                                    .then(async (editedMessage) => {
                                        // Update raid in database
                                        let updateData = { title: editedMessage.embeds[0].title }

                                        if (key == 2) {
                                            let editedDate = editedMessage.embeds[0].fields[0].name.split(" ");
                                            let editedTime = editedMessage.embeds[0].fields[1].name.split(" ");
                                            let rawtime = editedDate[1] + " " + editedTime[1] + " " + editedTime[2] + " " + editedTime[3];
                                            updateData.startsAt = moment.tz(new Date(rawtime).toUTCString(), "Atlantic/Azores").format('YYYY-MM-DD HH:mm:ss');
                                        }

                                        Raids.updateOne({ signupMessageId: signupMessage.id }, updateData)
                                            .then(() => {
                                                message.author.send('```Raid successfully updated!```');
                                            })
                                            .catch(error => {
                                                message.author.send('```I was unable to update your raid. Please try again.```');
                                            });
                                    });
                        });
                    })
                    .catch(error => {
                        // Do nothing
                    });
            });
    }
}
