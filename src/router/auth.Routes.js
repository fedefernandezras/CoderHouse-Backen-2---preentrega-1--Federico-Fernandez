import express from 'express';
import { register, login, current } from '../logincontroller/authController.js';
import passport from '../userModel/passport-config.js';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/current', passport.authenticate('jwt', { session: false }), current);

export default router;
