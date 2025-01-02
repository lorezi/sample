

import express, { Router } from 'express';
import {
  transactions
} from '../controllers/moniepointController';


const router: Router = express.Router({ mergeParams: true });




// Route for fetching all courses and creating a new course
router
  .route('/')
  .get(transactions);



export default router;
