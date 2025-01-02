

import express, { Router } from 'express';
import {
  getCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController';
import {
  protect,
  restrictTo,
} from '../controllers/authController';

const router: Router = express.Router({ mergeParams: true });

// Authentication Middleware
router.use(protect);
router
  .route('/')
  .get(getCourses)

router
  .route('/:id')
  .get(getCourse)

// Authorization Middleware
router.use(restrictTo('admin', 'teacher'));

// Route for fetching all courses and creating a new course
router
  .route('/')
  .post(createCourse);

// Route for fetching, updating, and deleting a specific course by ID
router
  .route('/:id')
  .patch(updateCourse)
  .delete(deleteCourse);

export default router;
