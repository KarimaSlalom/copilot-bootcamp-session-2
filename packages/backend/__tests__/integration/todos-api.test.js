/**
 * Integration tests for the TODO API endpoints.
 * Tests full HTTP request/response cycles using Supertest.
 */
const request = require('supertest');
const { app, db } = require('../../src/app');

beforeEach(() => {
  // Reset to a clean state before each test
  db.exec('DELETE FROM items');
});

afterAll(() => {
  if (db) {
    db.close();
  }
});

describe('TODO API Integration Tests', () => {
  describe('Health check', () => {
    it('GET / should return 200 with status ok', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });

  describe('Full CRUD workflow', () => {
    it('should create, read, update, and delete a task', async () => {
      // Create
      const createRes = await request(app)
        .post('/api/items')
        .send({ name: 'Integration Test Task', due_date: '2099-12-01' });
      expect(createRes.status).toBe(201);
      const id = createRes.body.id;
      expect(createRes.body.name).toBe('Integration Test Task');
      expect(createRes.body.completed).toBe(0);
      expect(createRes.body.due_date).toBe('2099-12-01');

      // Read
      const listRes = await request(app).get('/api/items');
      expect(listRes.status).toBe(200);
      expect(listRes.body.some(item => item.id === id)).toBe(true);

      // Update (mark complete)
      const patchRes = await request(app)
        .patch(`/api/items/${id}`)
        .send({ completed: true });
      expect(patchRes.status).toBe(200);
      expect(patchRes.body.completed).toBe(1);

      // Update (rename)
      const renameRes = await request(app)
        .patch(`/api/items/${id}`)
        .send({ name: 'Renamed Task' });
      expect(renameRes.status).toBe(200);
      expect(renameRes.body.name).toBe('Renamed Task');

      // Delete
      const deleteRes = await request(app).delete(`/api/items/${id}`);
      expect(deleteRes.status).toBe(200);

      // Verify deletion
      const afterDelete = await request(app).get('/api/items');
      expect(afterDelete.body.some(item => item.id === id)).toBe(false);
    });
  });

  describe('Sort order', () => {
    it('should return items sorted by created_at DESC by default', async () => {
      await request(app).post('/api/items').send({ name: 'First' });
      await request(app).post('/api/items').send({ name: 'Second' });
      await request(app).post('/api/items').send({ name: 'Third' });

      const response = await request(app).get('/api/items');
      expect(response.status).toBe(200);
      expect(response.body[0].name).toBe('Third');
      expect(response.body[2].name).toBe('First');
    });

    it('should return items sorted by due_date ASC NULLS LAST when sort=due_date', async () => {
      await request(app).post('/api/items').send({ name: 'No date' });
      await request(app).post('/api/items').send({ name: 'Far', due_date: '2099-12-31' });
      await request(app).post('/api/items').send({ name: 'Near', due_date: '2099-01-01' });

      const response = await request(app).get('/api/items?sort=due_date');
      expect(response.status).toBe(200);

      const names = response.body.map(i => i.name);
      expect(names[0]).toBe('Near');
      expect(names[1]).toBe('Far');
      expect(names[2]).toBe('No date');
    });
  });

  describe('Validation edge cases', () => {
    it('should reject a task with a whitespace-only name', async () => {
      const response = await request(app).post('/api/items').send({ name: '   ' });
      expect(response.status).toBe(400);
    });

    it('should reject PATCH with an invalid due_date', async () => {
      const createRes = await request(app).post('/api/items').send({ name: 'Task' });
      const id = createRes.body.id;

      const patchRes = await request(app)
        .patch(`/api/items/${id}`)
        .send({ due_date: 'tomorrow' });
      expect(patchRes.status).toBe(400);
    });
  });
});
