const passport = require('passport');
const refresh = require('passport-oauth2-refresh');
const DiscordStrategy = require('passport-discord').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    Users.findOne({ id })
        .then(user => {
            done(null, user);
        });
});

/*
refresh.requestNewAccessToken('discord', profile.refreshToken, ((err, accessToken, refreshToken) => {
    if (err) throw err;

    profile.accessToken = accessToken;
})); */

const discordStrat = new DiscordStrategy({
    clientID: sails.config.discord.clientID,
    clientSecret: sails.config.discord.clientSecret,
    callbackURL: sails.config.discord.callbackURL,
    scope: ['identify', 'guilds']
}, async (accessToken, refreshToken, profile, done) => {
    let guilds = [];

    profile.guilds.forEach((item, i) => {
        if (item.owner == true || item.permissions & 8 || item.permissions & 32) {
            guilds.push(item);
        }
    });

    let userData = {
        discordId: profile.id,
        username: profile.username,
        discriminator: profile.discriminator,
        avatar: profile.avatar || '',
        refreshToken: refreshToken,
        guilds: JSON.stringify(guilds)
    };

    Users.updateOne({ discordId: profile.id }).set(userData)
        .then(updatedUser => {
            // If a user was found and updated start session
            if (updatedUser) {
                done(null, updatedUser);
                return;
            }
            // Otherwise, create that user then start session
            else {
                Users.create(userData).fetch()
                    .then(user => {
                        done(null, user);
                        return;
                    });
            }
        });

    return;
});

passport.use(discordStrat);
refresh.use(discordStrat);
