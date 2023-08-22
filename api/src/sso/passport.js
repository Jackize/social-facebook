const passport = require("passport");
const { SECRET } = require("../utils/config");
const { ExtractJwt, Strategy: StrategyJwt } = require("passport-jwt");

passport.use(
    new StrategyJwt(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: SECRET,
        },
        async (jwtPayload, done) => {
            try {
                const user = await User.findOne({ where: { id: jwtPayload.id } });
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);
