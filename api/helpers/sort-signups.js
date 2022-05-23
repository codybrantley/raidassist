module.exports = {
    friendlyName: 'Sort Signups',
    description: 'Sorts all signups between normal signup and members added to roster for a specified raid',

    inputs: {
        data: {
            description: 'The signup data',
            type: ['ref'],
            required: true
        }
    },

    exits: {
        success: {
          outputFriendlyName: 'Sorted signups',
          outputDescription: 'An array of signups and members.',
        },
    },

    fn: function (inputs, exits) {
        let signups = [];
        let members = [];

        inputs.data.forEach((item, i) => {
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

        return exits.success([signups, members]);
    }
};
