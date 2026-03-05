import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

const mockTasks = [
  { id: 1, name: 'Test Task 1', completed: 0, due_date: null, created_at: '2024-01-02T00:00:00.000Z' },
  { id: 2, name: 'Test Task 2', completed: 0, due_date: '2099-06-15', created_at: '2024-01-01T00:00:00.000Z' },
];

const server = setupServer(
  rest.get('/api/items', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockTasks));
  }),

  rest.post('/api/items', (req, res, ctx) => {
    const { name } = req.body;
    if (!name || name.trim() === '') {
      return res(ctx.status(400), ctx.json({ error: 'Item name is required' }));
    }
    return res(
      ctx.status(201),
      ctx.json({ id: 3, name, completed: 0, due_date: null, created_at: new Date().toISOString() })
    );
  }),

  rest.delete('/api/items/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(ctx.status(200), ctx.json({ message: 'Item deleted successfully', id: parseInt(id) }));
  }),

  rest.patch('/api/items/:id', (req, res, ctx) => {
    const { id } = req.params;
    const updates = req.body;
    const task = mockTasks.find(t => t.id === parseInt(id));
    if (!task) return res(ctx.status(404), ctx.json({ error: 'Item not found' }));
    return res(ctx.status(200), ctx.json({ ...task, ...updates, completed: updates.completed ? 1 : task.completed }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component', () => {
  test('renders the app header', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('To Do App')).toBeInTheDocument();
    expect(screen.getByText('Keep track of your tasks')).toBeInTheDocument();
  });

  test('loads and displays tasks', async () => {
    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });
  });

  test('adds a new task', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const input = screen.getByRole('textbox', { name: /task name/i });
    await act(async () => {
      await user.type(input, 'New Test Task');
    });

    const submitButton = screen.getByRole('button', { name: /add task/i });
    await act(async () => {
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('New Test Task')).toBeInTheDocument();
    });
  });

  test('handles fetch API error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    server.use(
      rest.get('/api/items', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch tasks/)).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  test('shows empty state when no tasks', async () => {
    server.use(
      rest.get('/api/items', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('No items found. Add some!')).toBeInTheDocument();
    });
  });

  test('deletes a task', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: /delete "Test Task 1"/i });
    await act(async () => {
      await user.click(deleteButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument();
    });
  });

  test('toggles a task complete', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const checkbox = screen.getByRole('checkbox', { name: /mark "Test Task 1"/i });
    await act(async () => {
      await user.click(checkbox);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toHaveStyle({ textDecoration: 'line-through' });
    });
  });

  test('edits a task name', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /edit "Test Task 1"/i }));
    });

    const editInput = screen.getByRole('textbox', { name: /edit task name/i });
    await act(async () => {
      await user.clear(editInput);
      await user.type(editInput, 'Renamed Task');
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /save edit/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('Renamed Task')).toBeInTheDocument();
    });
  });

  test('shows error when adding a task fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    server.use(
      rest.post('/api/items', (req, res, ctx) => res(ctx.status(500)))
    );

    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const input = screen.getByRole('textbox', { name: /task name/i });
    await act(async () => {
      await user.type(input, 'Failing Task');
      await user.click(screen.getByRole('button', { name: /add task/i }));
    });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  test('shows error when deleting a task fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    server.use(
      rest.delete('/api/items/:id', (req, res, ctx) => res(ctx.status(500)))
    );

    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /delete "Test Task 1"/i }));
    });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  test('shows error when patching a task fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    server.use(
      rest.patch('/api/items/:id', (req, res, ctx) => res(ctx.status(500)))
    );

    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    await act(async () => {
      await user.click(screen.getByRole('checkbox', { name: /mark "Test Task 1"/i }));
    });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  test('dismisses an error when the alert close button is clicked', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    server.use(
      rest.get('/api/items', (req, res, ctx) => res(ctx.status(500)))
    );

    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /close/i }));
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    consoleSpy.mockRestore();
  });
});