import passport from "passport";
import { SECRET } from "../utils/config.js";
import passportJwt, { ExtractJwt, Strategy as StrategyJwt } from "passport-jwt";

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
