# Upskill

Instill Education is an Edtech company focused on providing
professional development opportunities for teachers across Africa
through its app, Upskill.

You are tasked with collaborating with the Product team to develop
new features and functions for our users.

## Build a Teacher Training API

Create a RESTful API for a teacher training application using Node.js,
Express, and MongoDB. The API should support the following operations:

1. Create a new training course
2. Retrieve all training courses
3. Retrieve a specific course by ID
4. Update an existing course
5. Delete a course

### Requirements

● Use Node.js and Express for the server

● Use MongoDB as the database (you can use a local instance or a
cloud service like MongoDB Atlas)

● Implement proper error handling and input validation

● Use async/await for asynchronous operations

● Include basic unit tests for at least two endpoints

### Bonus

● Implement user authentication using JWT

● Add pagination to the "retrieve all courses" endpoint


### Endpoints

```bash
Retrieve all courses 
GET {base_url}/api/v1/courses?limit=5&page=2
```

```bash
Create a course 
POST {base_url}/api/v1/courses

{
    "title": "MongoDB Test",
    "description": "xyz of mongodb",
    "category": "Technology"
}
```

```bash
Retrieve a single course 
GET {base_url}/api/v1/courses/{course_id}
```

```bash
Update a course 
PATCH {base_url}/api/v1/courses/{course_id}
```

```bash
Delete a course 
DELETE {base_url}/api/v1/courses/{course_id}
```

```bash
Signup for a new user 
POST {base_url}/api/v1/signup
{
    "name": "Elon Musk",
    "email": "musk@gmail.com",
    "password": "12345abc",
    "passwordConfirm": "12345abc"
}
```

```bash
Login
POST {base_url}/api/v1/login
{
    "email": "musk@gmail.com",
    "password": "12345abc"
}
```

```bash
Logout
GET {base_url}/api/v1/logout
```
