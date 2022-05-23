const { startCollection } = require('../helpers/functions');
const moment = require('moment-timezone');
module.exports = {
    name: 'converttime',
    permissions: [],
    description: 'Converts the raid time to a users local time',
    async execute(client, user, Discord, args) {
        let timezone;

        let sendMessage = () => {
            convertedDate = moment.tz(new Date(args[1]), timezone).format('dddd, MMMM Do [at] h:mm A');
            user.send("The raid starts for you on " + convertedDate);
        }

        Users.findOne({ discordId: user.id })
            .then(userData => {
                if (!userData) {
                    startCollection([
                        ["Enter your timezone", "option", client.timezones.map(time => time.name)]
                    ], user, Discord).then(data => {
                        console.log(data[0].content);
                        timezone = client.timezones.get(parseInt(data[0].content)).zone;

                        Users.create({
                            discordId: user.id,
                            timezone: timezone
                        }).fetch()
                            .then(() => {
                                sendMessage();
                            });
                    });
                } else {
                    timezone = userData.timezone;
                    sendMessage();
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
}
