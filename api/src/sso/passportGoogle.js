const passport = require("passport");
const { User } = require("../models");
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require("../utils/config");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/api/auth/google/callback",
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
            const defaultUser = {
                name: profile.name.givenName,
                username: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                avatarPic: profile.photos[0].value,
            };

            const user = await User.findOrCreate({
                where: { googleId: profile.id },
                defaults: defaultUser,
            }).catch((err) => {
                console.log("Failed to create user: ", err);
                done(err, null);
            });
            if (user && user[0]) return done(null, user && user[0]);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findOne({ where: { id } }).catch((err) => {
        console.log("Failed to find user: ", err);
        done(err, null);
    });
    if (user) done(null, user);
});
