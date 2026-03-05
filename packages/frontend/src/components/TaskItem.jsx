import { useState } from 'react';
import {
  ListItem,
  Checkbox,
  IconButton,
  TextField,
  Chip,
  Box,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export default function TaskItem({ task, onDelete, onToggleComplete, onEditName }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.name);

  const handleSaveEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== task.name) {
      onEditName(task.id, trimmed);
    }
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setEditValue(task.name);
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveEdit();
    if (e.key === 'Escape') handleCancelEdit();
  };

  const isOverdue =
    task.due_date && !task.completed && new Date(task.due_date) < new Date();

  return (
    <ListItem disableGutters sx={{ py: 1, alignItems: 'flex-start' }}>
      <Checkbox
        checked={Boolean(task.completed)}
        onChange={() => onToggleComplete(task.id, !task.completed)}
        inputProps={{
          'aria-label': `Mark "${task.name}" as ${task.completed ? 'incomplete' : 'complete'}`,
        }}
        sx={{ pt: 0.5 }}
      />

      <Box sx={{ flex: 1, mx: 1 }}>
        {editing ? (
          <TextField
            size="small"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            fullWidth
            inputProps={{ 'aria-label': 'Edit task name' }}
          />
        ) : (
          <>
            <Typography
              variant="body1"
              sx={{
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'text.secondary' : 'text.primary',
              }}
            >
              {task.name}
            </Typography>
            {task.due_date && (
              <Chip
                label={task.due_date}
                size="small"
                color={isOverdue ? 'error' : 'default'}
                sx={{ mt: 0.5 }}
              />
            )}
          </>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
        {editing ? (
          <>
            <Tooltip title="Save">
              <IconButton onClick={handleSaveEdit} size="small" aria-label="Save edit">
                <CheckIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel">
              <IconButton onClick={handleCancelEdit} size="small" aria-label="Cancel edit">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Tooltip title="Edit">
            <IconButton
              onClick={() => setEditing(true)}
              size="small"
              aria-label={`Edit "${task.name}"`}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Delete">
          <IconButton
            onClick={() => onDelete(task.id)}
            size="small"
            aria-label={`Delete "${task.name}"`}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </ListItem>
  );
}
