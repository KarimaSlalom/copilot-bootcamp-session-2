import { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import AppHeader from './components/AppHeader';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('created_at');

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/items?sort=${sort}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setTasks(result);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks: ' + err.message);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [sort]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAdd = async (name, dueDate) => {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, due_date: dueDate }),
      });
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      const newTask = await response.json();
      setTasks(prev => sort === 'created_at' ? [newTask, ...prev] : [...prev, newTask]);
      setError(null);
    } catch (err) {
      setError('Error adding task: ' + err.message);
      console.error('Error adding task:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/items/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      setTasks(prev => prev.filter(t => t.id !== id));
      setError(null);
    } catch (err) {
      setError('Error deleting task: ' + err.message);
      console.error('Error deleting task:', err);
    }
  };

  const handlePatch = async (id, updates) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      const updated = await response.json();
      setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
      setError(null);
    } catch (err) {
      setError('Error updating task: ' + err.message);
      console.error('Error updating task:', err);
    }
  };

  const handleToggleComplete = (id, completed) => handlePatch(id, { completed });
  const handleEditName = (id, name) => handlePatch(id, { name });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 2.5 }}>
        <AppHeader />
        <Box component="main" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <AddTaskForm onAdd={handleAdd} />
          <TaskList
            tasks={tasks}
            loading={loading}
            error={error}
            onDismissError={() => setError(null)}
            sort={sort}
            onSortChange={setSort}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
            onEditName={handleEditName}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;