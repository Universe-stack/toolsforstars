import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User, { IUser } from '../models/userModel'; // Import your User model


passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email: string, password: string, done: any) => {
    try {
      const user: IUser | null = await User.findOne({ email });

      if (!user || !(await user.isValidPassword(password))) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((_id, done) => {
  User.findById(_id, (err:Error, user:any) => {
      done(err, user);
  });
});

export default passport;
