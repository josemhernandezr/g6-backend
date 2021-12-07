var express = require('express');
var router = express.Router();

const passport = require('passport');
const passportJWT = require('passport-jwt');
const extractJWT = passportJWT.ExtractJwt;
const strategyJWT = passportJWT.Strategy;

passport.use(
  new strategyJWT(
    {
      jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    (payload, next) => {
      return next(null, payload);
    }
  )
);

const jwtMiddleware = passport.authenticate('jwt', {session:false});

router.use(passport.initialize());

var songsRouter = require('./songs/index');
var secRouter = require('./sec/index');

router.get('/', (req, res, next)=>{
    res.status(200).json({"msg":"Api V1 JSON"});
  }
);

router.use('/sec', secRouter);
router.use('/songs', jwtMiddleware,songsRouter);

module.exports = router;
