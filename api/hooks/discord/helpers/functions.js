const moment = require('moment-timezone');

/**
 * Executes a discord command
 *
 * Runs from a message or reaction input triggered by a user
 *
 * @param string command The name of the command to execute
 * @param class client The user class that triggered the function
 * @param class message The message class if triggered by a message
 * @param class args Additional arguments to pass (usually the reaction class)
 */
let executeCommand = async (command, client, message, Discord, ...args) => {
    let user = message.author || message;
    let member = message.member || await client.guilds.fetch(args[0].message.guild.id).then(guild => guild.member(user));

    if(command.permissions.length) {
        let invalidPerms = [];
        for (const perm of command.permissions) {
            if (!["ADMINISTRATOR", "MANAGE_CHANNELS", "MANAGE_GUILD", "MANAGE_MESSAGES", "MANAGE_ROLES"].includes(perm)) {
                return console.log(`Invalid Permissions ${perm}`);
            }
            if (!member.hasPermission(perm)) {
                invalidPerms.push(perm);
            }
        }
        if (invalidPerms.length) {
            return user.send(`Missing Permissions: \`${invalidPerms}\``);
        }
    }

    try {
        command.execute(client, message, Discord, args);
    } catch (error) {
        message.reply("An error occured trying to run your command. Please try again.");
    }
}

/**
 * Formats a name to normal text
 *
 * @param string name The name to format
 */
let formatName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

/**
 * Formats a number to add leading zeros if necessary
 *
 * @param integer number The number to format
 */
let formatNumber = (number) => {
    let leading = ((number > 9) ? "" : "0");
    let numberString = String(number);
    return leading + numberString;
}

/**
 * Validates an input given from a message collector
 *
 * @param string input The message that was sent
 * @param string expects The type of format the message should be in
 * @param integer maxLength The maximum number a user can input (usually the length of a selection array)
 */
let validateInput = (input, expects, maxLength = 0) => {
    switch (expects) {
        case "string":
            if (!/^[A-Za-z0-9\w\s\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?]+$/.test(input)) {
                return "Invalid input.";
            }
            return true;
            break;
        case "name":
            if (!/^([A-Za-z]){2,12}$/.test(input)) {
                return "Invalid input.";
            }
            return true;
            break;
        case "option":
            if (!/^(0|1|)[0-9]{1,2}$/.test(input)) {
                return "Invalid input.";
            }
            if (input > maxLength || input === "00") {
                return "Invalid number.";
            }
            return true;
        case "date":
            if (!/^(|(0?[1-9])|(1[0-2]))\/((0[1-9])|(1\d)|(2\d)|(3[0-1]))\/((\d{4})) (0?[1-9]|1[0-2]):[0-5][0-9]\s[AaPp][Mm]$/.test(input)) {
                return "Invalid date format. (follow format example: " + moment().format('L LT') + ")";
            }
            return true;
            break;
        case "offset":
            if (!/^(\+([0-9]|1[0-4])|\-([1-9]|1[0-1]))(?::[3,4][0,5])?$/.test(input)) {
                return "Invalid offset. Please use the correct format. (i.e -4 or +5:30";
            }
            return true;
            break;
        default:
            return false;
    }
}

/**
 * Creates a formatted message with options to select
 *
 * @param string text The question/statement to make before the options
 * @param array data The list of options to display
 */
let createOptionsSelector = (text, data) => {
    let message = "> **" + text + "**";
    let number = 1;
    data.forEach((item, i) => { message += " \n > `" + ((number > 9) ? "" : "0") + number++ + "` " + item; });
    return [message, data.length];
}

/**
 * Starts a message collector with a specific user
 *
 * @param array questions All of the questions to ask
 * @param class user The user who triggered the collection
 * @param string text The information to display before the collector starts
 */
let startCollection = (questions, user, Discord, initialInfo = "") => {
    return new Promise(async (resolve, reject) => {
        let step = 0;
        let maxLength = 0;
        let channel = await user.createDM();
        let collected = [];
        let selection = false;

        // Create collector
        let collector = new Discord.MessageCollector(channel, (m => m.author.id === user.id), { time: 300000, dispose: true });

        let sendQuestion = () => {
            selection = (collected.length > 0 & questions[step][1] == "selection") ? (collected[collected.length-1].match(/(1|)[1-9]/)[0]-1) : false;
            let index = (selection === false) ? questions[step] : questions[step][2][selection];
            maxLength = Array.isArray(index[2]) ? index[2].length : 0;
            user.send((index[1] == "option") ? createOptionsSelector(index[0], index[2])[0] : '```' + index[0] + '```');
        }

        // Send first question
        sendQuestion();

        // On user input
        collector.on('collect', (m) => {
            // Retrieve expected input type
            let inputType = (selection === false) ? questions[step][1] : questions[step][2][selection][1];

            // Validate input
            let validator = validateInput(m.content, inputType, maxLength);

            // If validation passes send next question
            if (validator == true) {
                step++;
                if (step < questions.length) {
                    collector.resetTimer();
                    collected.push(m.content);
                    sendQuestion();
                } else {
                    collector.stop();
                }
            } else {
                // Delete input and send error message
                collector.handleDispose(m);
                m.channel.send('```' + validator + '```');
            }
        });

        // After collection ends, resolve promise with collected data
        collector.on('end', async (collection) => {
            let data = collection.array();
            resolve(data);
        });
    });
}

module.exports = {
    executeCommand,
    validateInput,
    formatName,
    formatNumber,
    startCollection
};
