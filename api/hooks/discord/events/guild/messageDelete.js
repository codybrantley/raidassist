module.exports = async (client, Discord, message) => {
    if (!message.author || !message.author.bot) return;
    if (!message.embeds[0]) return;

    /*

    // See if message was a raid signup
    let type = message.embeds[0].footer.text.split(" ")[0];

    if (type == "Signup") {
        Raid.findOneAndDelete({ signupMessageId: message.id })
            .catch(error => {
                log.error(error, message.author.id);
            });
        Signup.deleteMany({ raidId: message.id })
            .catch(error => {
                log.error(error, message.author.id);
            });
    }

    if (type == "Roster") {


    }

    */
}
