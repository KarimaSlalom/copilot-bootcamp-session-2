const request = require('supertest');
const { app, db } = require('../src/app');

afterAll(() => {
  if (db) {
    db.close();
  }
});

const createItem = async (name = 'Temp Item', dueDate = null) => {
  const response = await request(app)
    .post('/api/items')
    .send({ name, due_date: dueDate })
    .set('Accept', 'application/json');

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('id');
  return response.body;
};

describe('API Endpoints', () => {
  describe('GET /', () => {
    it('should return health check status', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
    });
  });

  describe('GET /api/items', () => {
    it('should return all items with correct fields', async () => {
      const response = await request(app).get('/api/items');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const item = response.body[0];
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('completed');
      expect(item).toHaveProperty('due_date');
      expect(item).toHaveProperty('created_at');
    });

    it('should sort by due_date when sort=due_date', async () => {
      await createItem('No due date');
      await createItem('Far future', '2099-12-31');
      await createItem('Near future', '2099-01-01');

      const response = await request(app).get('/api/items?sort=due_date');
      expect(response.status).toBe(200);

      const withDates = response.body.filter(item => item.due_date !== null);
      const dates = withDates.map(item => item.due_date);
      const sorted = [...dates].sort();
      expect(dates).toEqual(sorted);
    });
  });

  describe('POST /api/items', () => {
    it('should create a new item with name only', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ name: 'Test Item' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test Item');
      expect(response.body.completed).toBe(0);
      expect(response.body.due_date).toBeNull();
      expect(response.body).toHaveProperty('created_at');
    });

    it('should create a new item with a due date', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ name: 'Task with due date', due_date: '2099-06-15' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.due_date).toBe('2099-06-15');
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({})
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Item name is required');
    });

    it('should return 400 if name is empty', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ name: '' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Item name is required');
    });

    it('should return 400 for invalid due_date format', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ name: 'Task', due_date: 'not-a-date' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /api/items/:id', () => {
    it('should update item name', async () => {
      const item = await createItem('Original Name');
      const response = await request(app)
        .patch(`/api/items/${item.id}`)
        .send({ name: 'Updated Name' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Name');
      expect(response.body.id).toBe(item.id);
    });

    it('should toggle completed to true', async () => {
      const item = await createItem('Task to complete');
      const response = await request(app)
        .patch(`/api/items/${item.id}`)
        .send({ completed: true })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(1);
    });

    it('should set due_date', async () => {
      const item = await createItem('Task without due date');
      const response = await request(app)
        .patch(`/api/items/${item.id}`)
        .send({ due_date: '2099-03-15' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.due_date).toBe('2099-03-15');
    });

    it('should clear due_date when set to null', async () => {
      const item = await createItem('Task with date', '2099-01-01');
      const response = await request(app)
        .patch(`/api/items/${item.id}`)
        .send({ due_date: null })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.due_date).toBeNull();
    });

    it('should return 404 when item does not exist', async () => {
      const response = await request(app)
        .patch('/api/items/999999')
        .send({ name: 'Ghost' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Item not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app)
        .patch('/api/items/abc')
        .send({ name: 'Test' });

      expect(response.status).toBe(400);
    });

    it('should return 400 when no valid fields provided', async () => {
      const item = await createItem('Task');
      const response = await request(app)
        .patch(`/api/items/${item.id}`)
        .send({});

      expect(response.status).toBe(400);
    });

    it('should return 400 when completed is not a boolean', async () => {
      const item = await createItem('Task');
      const response = await request(app)
        .patch(`/api/items/${item.id}`)
        .send({ completed: 'yes' });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('should delete an existing item', async () => {
      const item = await createItem('Item To Be Deleted');

      const deleteResponse = await request(app).delete(`/api/items/${item.id}`);
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toEqual({ message: 'Item deleted successfully', id: item.id });

      const deleteAgain = await request(app).delete(`/api/items/${item.id}`);
      expect(deleteAgain.status).toBe(404);
    });

    it('should return 404 when item does not exist', async () => {
      const response = await request(app).delete('/api/items/999999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Item not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app).delete('/api/items/abc');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Valid item ID is required');
    });
  });
});

describe('API Endpoints', () => {
  describe('GET /api/items', () => {
    it('should return all items', async () => {
      const response = await request(app).get('/api/items');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Check if items have the expected structure
      const item = response.body[0];
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('created_at');
    });
  });

  describe('POST /api/items', () => {
    it('should create a new item', async () => {
      const newItem = { name: 'Test Item' };
      const response = await request(app)
        .post('/api/items')
        .send(newItem)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newItem.name);
      expect(response.body).toHaveProperty('created_at');
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({})
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Item name is required');
    });

    it('should return 400 if name is empty', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ name: '' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Item name is required');
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('should delete an existing item', async () => {
      const item = await createItem('Item To Be Deleted');

      const deleteResponse = await request(app).delete(`/api/items/${item.id}`);
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toEqual({ message: 'Item deleted successfully', id: item.id });

      const deleteAgain = await request(app).delete(`/api/items/${item.id}`);
      expect(deleteAgain.status).toBe(404);
      expect(deleteAgain.body).toHaveProperty('error', 'Item not found');
    });

    it('should return 404 when item does not exist', async () => {
      const response = await request(app).delete('/api/items/999999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Item not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app).delete('/api/items/abc');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Valid item ID is required');
    });
  });
});