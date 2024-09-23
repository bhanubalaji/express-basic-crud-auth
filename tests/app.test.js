// tests/app.test.js
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../index'); // Export your Express app from index.js
const User = require('../models/user'); // Adjust the path to your User model

describe('api testing', () => {
  let token;

  beforeAll(async () => {
    // Create a mock user and generate a JWT token
    const user = await User.create({
      email: 'mockTest@example123.com',
      password: 'password123',
      confirmPassword: 'password123',
      nickname: 'testUser',
      ischecked: true,
      mobile: '1234567890',
    });
    token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  it('should respond with items fetched successfully for get items api', async () => {
    const response = await request(app)
      .get('/api/getItems')
      .set('Cookie', `usertoken=${token}`); // Set the cookie for authentication

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: 200,
      success: true,
      message: "items fetched successfully",
      data: expect.any(Array), // Adjust based on your actual response structure
    });
  });

  afterAll(async () => {
    // Clean up the test user
    await User.deleteMany({ email: 'mockTest@example123.com' });
  });
});
