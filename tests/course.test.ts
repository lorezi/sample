
import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../src/app';

import Course from '../src/models/courseModel';

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE!.replace('<PASSWORD>', process.env.DATABASE_PASSWORD!);



beforeAll(async () => {
  await mongoose.connect(DB);
});


describe('Course Endpoints', () => {
  describe('POST /api/v1/courses', () => {
    it('should create a new course', async () => {
      const res = await request(app)
        .post('/api/v1/courses')
        .send({
          title: 'Jest Course',
          description: 'This is a Jest course.',
          category: 'Technology',
        })
        .expect(201);

      expect(res.body.status).toBe('success');
      expect(res.body.data.data).toMatchObject({
        title: 'Jest Course',
        description: 'This is a Jest course.',
        category: 'Technology',
      });

      // Verify course is saved in the database
      const course = await Course.findOne({ title: 'Jest Course' });
      expect(course).not.toBeNull();
      expect(course?.description).toBe('This is a Jest course.');
    });

  });


});

describe('GET /api/v1/courses', () => {
  beforeAll(async () => {
  
    await Course.create([
      {
        title: 'Jest One',
        description: 'Description for Jest one.',
        category: 'Science',
      },
      {
        title: 'Jest Two',
        description: 'Description for Jest two.',
        category: 'Arts',
      },
    ]);
  });

  it('should retrieve all courses', async () => {
    const res = await request(app)
      .get('/api/v1/courses')
      .expect(200);

    expect(res.body.status).toBe('success');
    expect(res.body.results).toBeGreaterThanOrEqual(2);

  });
});
