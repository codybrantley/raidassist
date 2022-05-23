module.exports = (client, Discord, guild) => {
    Guild.findOneAndDelete({ id: guild.id })
        .catch(error => {
            log.error(error, guild.id);
        });
    Raid.deleteMany({ guildId: guild.id })
        .catch(error => {
            log.error(error, guild.id);
        });
}
