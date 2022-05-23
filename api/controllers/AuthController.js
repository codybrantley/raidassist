/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const passport = require('passport');
const refresh = require('passport-oauth2-refresh');

module.exports = {
    login: (req, res) => {
        passport.authenticate('discord')(req, res);
    },

    redirect: (req, res) => {
        passport.authenticate('discord', (err, user, info) => {
            req.login(user, (error => {
                if (error) res.send(error);
            }));

            let redirectTo = req.session.redirectTo ? req.session.redirectTo : '/dashboard';
            delete req.session.redirectTo;

            res.redirect(redirectTo);
        })(req, res);
    },

    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    }
};
