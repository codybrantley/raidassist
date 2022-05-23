/**
 * RaidsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    find: async function(req, res) {
        let guilds = JSON.parse(req.user.guilds);
        let raids = [];

        await Promise.all(guilds.map(async guild => {
            await Raids.find({ guildId: guild.id })
                .then(foundRaids => {
                    if (foundRaids.length > 0) raids.push([guild.name, foundRaids]);
                });
        }));

        res.view('raids/index', { raids });
    },

    findOne: function(req, res) {
        let guilds = JSON.parse(req.user.guilds);
        Raids.findOne({ _id: parseInt(req.params.id) })
            .then(async raid => {
                // If raid doesnt exit
                if (!raid) { res.view('raids/noraid'); return; }

                // Check if user has valid permissions
                let permission = guilds.filter(guild => guild.id == raid.guildId);
                if (permission.length == 0) { res.view('raids/noperm', { raid }); return; }

                // Show manage roster page
                let data = await Signups.find({ raidId: String(req.params.id) });
                let [signups, members] = await sails.helpers.sortSignups(data);
                res.view('raids/show', { raid, signups, members });
            })
            .catch(error => {
                console.log(error);
            });
    }
};
