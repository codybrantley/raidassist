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
let sortSignups = (data) => {
    return new Promise(async (resolve, reject) => {
        let signups = [];
        let members = [];

        data.forEach((item, i) => {
            let [classEmoji, intentEmoji] = item.signupValue.match(/<[a-z0-9:_]{1,}>/gi);
            item.classEmoji = classEmoji;
            item.intentEmoji = intentEmoji;
            let className = classEmoji.split(":")[1];

            if (className.includes("_")) {
                className = className.split("_")[1];
            }

            let split = item.signupValue.split(">`")[1].replace("`", "").split(" ");
            item.number = split[0];
            item.name = split[1];

            // Add class array if nonexistant
            if (item.member) {
                if (!members.some(classObj => classObj.className === className)) {
                    members.push({ className: className, contents: [] });
                }
                if (!item.confirmed && !item.rejected) {
                    item.undecided = true;
                } else {
                    item.undecided = false;
                }
                members.find(classObj => classObj.className == className).contents.push(item);
            } else {
                if (!signups.some(classObj => classObj.className === className)) {
                    signups.push({ className: className, contents: [] });
                }
                signups.find(classObj => classObj.className == className).contents.push(item);
            }
        });

        resolve([signups, members]);
    });
}

module.exports = {
    sortSignups
};
