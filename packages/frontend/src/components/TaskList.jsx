import {
  Box,
  Typography,
  List,
  Divider,
  CircularProgress,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import TaskItem from './TaskItem';

export default function TaskList({
  tasks,
  loading,
  error,
  onDismissError,
  sort,
  onSortChange,
  onDelete,
  onToggleComplete,
  onEditName,
}) {
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" component="h2">
          Tasks
        </Typography>
        <ToggleButtonGroup
          value={sort}
          exclusive
          onChange={(_, val) => val && onSortChange(val)}
          size="small"
          aria-label="Sort order"
        >
          <ToggleButton value="created_at" aria-label="Sort by newest first">
            Newest
          </ToggleButton>
          <ToggleButton value="due_date" aria-label="Sort by due date">
            Due date
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box aria-live="polite">
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress aria-label="Loading tasks" />
          </Box>
        )}
        {error && (
          <Alert
            severity="error"
            onClose={onDismissError}
            sx={{ mb: 1 }}
          >
            {error}
          </Alert>
        )}
        {!loading && !error && (
          tasks.length > 0 ? (
            <List disablePadding>
              {tasks.map((task, index) => (
                <Box key={task.id}>
                  <TaskItem
                    task={task}
                    onDelete={onDelete}
                    onToggleComplete={onToggleComplete}
                    onEditName={onEditName}
                  />
                  {index < tasks.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          ) : (
            <Typography variant="body1" sx={{ py: 2 }}>
              No items found. Add some!
            </Typography>
          )
        )}
      </Box>
    </Box>
  );
}
