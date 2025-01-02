
import Course, { ICourse } from '../models/courseModel';
import * as factory from './handlerFactory';

/**
 * Controller to create a new course
 */
export const createCourse = factory.createOne<ICourse>(Course);

/**
 * Controller to get all courses
 */
export const getCourses = factory.getAll<ICourse>(Course);

/**
 * Controller to get a single course by ID
 */
export const getCourse = factory.getOne<ICourse>(Course);

/**
 * Controller to update a course by ID
 */
export const updateCourse = factory.updateOne<ICourse>(Course);

/**
 * Controller to delete a course by ID
 */
export const deleteCourse = factory.deleteOne<ICourse>(Course);
