const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/UserModel");
const config = require("./config");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken("User");
opts.secretOrKey = config.secretOrKey;
const jwtLogin = new JwtStrategy(opts, async (payload, done) => {
  try {
    // Use async/await instead of the callback pattern
    const user = await User.findById(payload.id);
    if (user) {
      return done(null, user);  // Successfully found the user
    } else {
      return done(null, false, { message: "User not found", tokenExpired: true });  // No user found
    }
  } catch (err) {
    return done(err, false);  // Handle any errors during the database query
  }
});

// Use the JWT strategy in Passport
passport.use(jwtLogin);
