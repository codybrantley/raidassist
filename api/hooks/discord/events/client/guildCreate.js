module.exports = (client, Discord, guild) => {
    new Guild({
        id: guild.id,
        ownerId: guild.ownerID
    }).save()
        .then(async () => {
            let user = await guild.members.fetch(guild.ownerID);
            user.send("***Thank you for adding me to your server!***");
        })
        .catch(error => {
            log.error(error, guild.id);
        });
}
