import { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function AddTaskForm({ onAdd }) {
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), dueDate || null);
    setName('');
    setDueDate('');
  };

  return (
    <Box
      component="section"
      sx={{
        bgcolor: 'background.paper',
        p: 2.5,
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
        Add New Task
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}
      >
        <TextField
          variant="outlined"
          size="small"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter task name"
          inputProps={{ 'aria-label': 'Task name' }}
          sx={{ flex: 1, minWidth: 180 }}
        />
        <TextField
          variant="outlined"
          size="small"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          inputProps={{ 'aria-label': 'Due date' }}
        />
        <Button
          type="submit"
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          aria-label="Add task"
        >
          Add
        </Button>
      </Box>
    </Box>
  );
}
