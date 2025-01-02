import express, { Router } from 'express';
import { signup, login, logout } from '../controllers/authController';

const router: Router = express.Router();

/**
 * Authentication and Authorization
 */

// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

// Logout Route
router.get('/logout', logout);

export default router;
